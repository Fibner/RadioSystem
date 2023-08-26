const config = require("./config");
const express = require("express");
const app = express();
const port = config.PORT;
const facebookRouter = require("./routes/facebook");
const apiRouter = require("./routes/api");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const WebSocket = require("ws");
const { uuid } = require("uuidv4");
const {
  randomSong,
  getSong,
  addHistory,
  getUsers,
  getRequests,
  declineRequest,
  acceptRequest,
  getSongs,
  deleteSong,
} = require("./routes/db");
const fs = require("fs");
let { player, admin } = require("./globals");

//Initial configurations
// app.use(cors());
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/radiowezel", {
  useNewUrlParser: true,
});
app.use(
  cors({ origin: `${config.FRONTEND_HOST}`, credentials: true, methods: "GET" })
);
app.use(require("cookie-parser")("Kot w łóżku"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Adding routes to express server
app.use("/facebook", facebookRouter);
app.use("/api", apiRouter);

//Start listening
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});

// setInterval(()=>{
//   console.log(admin);
// }, 1000)

//Creating WebSocket Server
const wsServer = new WebSocket.Server({ server });
wsServer.on("connection", function (ws) {
  let type = null;

  ws.on("message", async (message) => {
    const json = JSON.parse(message.toString());
    console.log(json);
    if (json.new) {
      console.log("New connection");
      if (json.type === "player") {
        type = "player";
        player = { type: "player", ws: ws };
        isPlaying = false;
        // ws.send(JSON.stringify({ state: true }));
        verifyPlayerState();
      }
      if (json.type === "admin") {
        type = "admin";
        admin.type = "admin";
        admin.ws = ws;
        if (json.cb) {
          switch (json.cb) {
            case "users":
              return ws.send(JSON.stringify({ users: await getUsers() }));
            case "requests":
              return ws.send(JSON.stringify({ requests: await getRequests() }));
            case "songs":
              return ws.send(JSON.stringify({ songs: await getSongs() }));
            default:
              return;
          }
        }
      }
    }
    if (type === "player") {
      if (json.playerReady) {
        let _songId = await randomSong();
        addHistory(await getSong(_songId));
        ws.send(JSON.stringify({ songID: _songId, brake: brake.watch }));
      }
      if (json.state !== undefined) {
        switch (json.state) {
          case -1:
            isPlaying = false;
            return;
          case 0:
            let _songId = await randomSong();
            addHistory(await getSong(_songId));
            ws.send(JSON.stringify({ songID: _songId, brake: brake.watch }));
            return;
          case 1:
            isPlaying = true;
            break;
          case 2:
            isPlaying = false;
            break;
        }
        // console.log(isPlaying);
        verifyPlayerState();
      }
    }
    if (type === "admin") {
      if (json.action) {
        switch (json.action) {
          case "next":
            let _songId = await randomSong();
            addHistory(await getSong(_songId));
            player.ws.send(
              JSON.stringify({ songID: _songId, brake: brake.watch })
            );
          case "unmute":
            player.ws.send(
              JSON.stringify({ command: "unmute"})
            );
            return;
          case "delete":
            await new Promise((resolve, reject) => {
              deleteSong(json.songId)
                .then(() => resolve())
                .catch((err) => reject(err));
            });
            return ws.send(JSON.stringify({ songs: await getSongs() }));
          default:
            return;
        }
      }
      if (json.verdict !== null) {
        if (json.verdict) {
          await new Promise((resolve, reject) => {
            acceptRequest(json.songId)
              .then(() => resolve())
              .catch((err) => reject(err));
          });
        } else if (!json.verdict) {
          await new Promise((resolve, reject) => {
            declineRequest(json.songId)
              .then(() => resolve())
              .catch((err) => reject(err));
          });
        }
        return ws.send(JSON.stringify({ requests: await getRequests() }));
      }
    }
    // console.log(Object.keys(player)[0]);
  });
  ws.on("close", () => {
    if (type === "player") {
      delete player, (isPlaying = false);
    }
    if (type === "admin") {
      delete type;
      delete admin.type;
      delete admin.ws;
    }
    // console.log(player);
  });
  // player.ws.on("message", async (message) => {
  //   const json = JSON.parse(message.toString());
  //   console.log(json);
  //   if (type === "player") {
  //     if (json.playerReady) {
  //       let _songId = await randomSong();
  //       addHistory(await getSong(_songId));
  //       ws.send(JSON.stringify({ songID: _songId, brake: brake.watch }));
  //     }
  //     if (json.state !== undefined) {
  //       switch (json.state) {
  //         case -1:
  //           isPlaying = false;
  //           return;
  //         case 0:
  //           ws.send(
  //             JSON.stringify({ songID: await randomSong(), brake: brake.watch })
  //           );
  //           return;
  //         case 1:
  //           isPlaying = true;
  //           break;
  //         case 2:
  //           isPlaying = false;
  //           break;
  //       }
  //       // console.log(isPlaying);
  //       verifyPlayerState();
  //     }
  //   }
  // });
  //// console.log(wsServer.clients.size);
});
//// app.get("*", (req, res)=>{
////   res.redirect(`${config.FRONTEND_HOST}`);
//// })

//player logic
let json = JSON.parse(fs.readFileSync("./breaks.json")).breaks;
let isPlaying = false;
let brake = new Proxy( //dont touch this variable!
  {},
  {
    set: function (target, property, value) {
      // do something
      target[property] = value;
      verifyPlayerState();
    },
  }
);
brake.watch = false; //but you can touch this!

function verifyPlayerState() {
  console.log("Sprawdzam!");
  console.log("brake", brake.watch);
  console.log("gra", isPlaying);
  if (!player.ws) return;
  if (brake.watch) {
    if (!isPlaying) {
      console.log("puszczam piosenke");
      playSong();
    }
  }
  if (!brake.watch) {
    if (isPlaying) {
      console.log("zatrzymuje piosenke");
      pauseSong();
    }
  }
}
// setInterval(()=>{
//   console.log("przerwa",brake.watch)
//   console.log("gra",isPlaying)
// }, 1000)

setInterval(() => {
  const time = new Date().toLocaleTimeString("pl-PL");
  // console.log("Przerwa", brake.watch);
  // console.log("Gra", isPlaying);

  if (new Date().getDay() == 6 || new Date().getDay() == 0) {
    if (brake.watch) {
      // console.log("weekend")
      return (brake.watch = false);
    }
    return;
  }
  if (time > json[0][0] && time < json[0][1]) {
    if (!brake.watch) {
      // console.log("0")
      return (brake.watch = true);
    } else {
      return;
    }
  } else if (time > json[1][0] && time < json[1][1]) {
    if (!brake.watch) {
      // console.log("1")
      return (brake.watch = true);
    } else {
      return;
    }
  } else if (time > json[2][0] && time < json[2][1]) {
    if (!brake.watch) {
      // console.log("2")
      return (brake.watch = true);
    } else {
      return;
    }
  } else if (time > json[3][0] && time < json[3][1]) {
    if (!brake.watch) {
      // console.log("3")
      return (brake.watch = true);
    } else {
      return;
    }
  } else if (time > json[4][0] && time < json[4][1]) {
    if (!brake.watch) {
      // console.log("4")
      return (brake.watch = true);
    } else {
      return;
    }
  } else if (time > json[5][0] && time < json[5][1]) {
    if (!brake.watch) {
      // console.log("5")
      return (brake.watch = true);
    } else {
      return;
    }
  } else if (time > json[6][0] && time < json[6][1]) {
    if (!brake.watch) {
      // console.log("6")
      return (brake.watch = true);
    } else {
      return;
    }
  } else if (time > json[7][0] && time < json[7][1]) {
    if (!brake.watch) {
      // console.log("7")
      return (brake.watch = true);
    } else {
      return;
    }
  } else if (time > json[8][0] && time < json[8][1]) {
    if (!brake.watch) {
      // console.log("8")
      return (brake.watch = true);
    } else {
      return;
    }
  }
  if (brake.watch) {
    // console.log("lekcja")
    return (brake.watch = false);
  } else {
    return;
  }
}, 500);

function playSong() {
  if (!player.ws) return;
  player.ws.send(JSON.stringify({ state: "play" }));
}
function pauseSong() {
  if (!player.ws) return;
  player.ws.send(JSON.stringify({ state: "pause" }));
}

exports.admin = { admin };
