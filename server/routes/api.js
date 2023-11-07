const router = require("express").Router();
const config = require("../config");
const passport = require("passport");
const mongoose = require("mongoose");
const User = require("../schemas").User;
const axios = require("axios");
const { Song, Request } = require("../schemas");
const fs = require("fs");
const { randomSong, getSong, getHistory, getRequests } = require("./db");
const { admin } = require("../globals");

router.use(passport.initialize());
router.use(passport.session());
router.get("/auth", (req, res) => {
  if (req.isAuthenticated()) {
    if(req.user.id === '409757439634833419'){
      res.status(200).json({
        authenticated: true,
        admin: true,
        user: req.user,
        cookies: req.cookies,
      });
      return;
    }
    // console.log("zweryfikowany: prawda");
    res.status(200).json({
      authenticated: true,
      user: req.user,
      cookies: req.cookies,
    });
  } else {
    // console.log("zweryfikowany: fałsz");
    res.status(403).send();
  }
});
/*
// router.get("/testdb", (req, res) => {

//   mongoose.connect('mongodb://127.0.0.1:27017/radiowezel',(err)=>{
//     if(err) return console.log(err);
//     console.log("Połączono")
//     User.findOne({}, (err, result)=>console.log(result.name));
//   });
//   mongoose.connection.close();
// });
*/
router.get("/test", async (req, res) => {
  let test = await randomSong();
  res.json(test);
});

router.post("/addSong", async (req, res) => {
  if (req.isAuthenticated()) {
    //check if song id is correct
    let requestId = req.body.url.trim().replace(" ", "");
    if (requestId == null || requestId == "" || requestId.length != 11) {
      return res.status(406).send("Zły link");
    }

    //check if song in already in database
    let temp = await Song.findOne({ songId: requestId });
    let tempReq = await Request.findOne({songId: requestId});
    if (temp || tempReq) return res.status(406).send("Piosenka jest już w bazie");

    //call youtube api to get data about song
    let ytResponse = await axios
      .get(
        "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics&id=" +
          requestId +
          "&key=AIzaSyBxuehPzwidUtunmeg-B-dp606aV4eZEGU"
      )
      .then((res) => {
        if (res.status != 200) return null;
        return res.data.items[0];
      });
    if (ytResponse == null)
      return res.status(406).send("Nie istnieje taka piosenka");
    //call returnyouutbedislike api to get dislike info about song
    let ytDislikes = await axios
      .get("https://returnyoutubedislikeapi.com/votes?videoId=" + requestId)
      .then((res) => {
        if (res.status == 200) return res.data;
        return null;
      });
    //create mongoose scheme
    if (req.user.id === "2518686474951819") {
      let song = new Song({
        songId: ytResponse.id,
        title: ytResponse.snippet.title,
        thumbnail: ytResponse.snippet.thumbnails.default.url,
        publishedDate: new Date(ytResponse.snippet.publishedAt),
        link: "https://www.youtube.com/watch?v=" + ytResponse.id,
        viewCount: ytResponse.statistics.viewCount,
        likeCount: ytResponse.statistics.likeCount,
        dislikeCount: ytDislikes.dislikes,
        commentCount: ytResponse.statistics.commentCount,
        addBy: req.user.id,
      });
      song.save((err) =>
        err ? res.status(500).send("Bład w dodawaniu do bazy") : null
      );
    } else {
      let request = new Request({
        songId: ytResponse.id,
        title: ytResponse.snippet.title,
        thumbnail: ytResponse.snippet.thumbnails.default.url,
        publishedDate: new Date(ytResponse.snippet.publishedAt),
        link: "https://www.youtube.com/watch?v=" + ytResponse.id,
        viewCount: ytResponse.statistics.viewCount,
        likeCount: ytResponse.statistics.likeCount,
        dislikeCount: ytDislikes.dislikes,
        commentCount: ytResponse.statistics.commentCount,
        addBy: req.user.id,
        requestDate: new Date(),
      });
      request.save(async (err) =>{
        if(err) return res.status(500).send("Bład w dodawaniu do bazy");
        if(admin.ws) admin.ws.send(JSON.stringify({requests: await getRequests()}));
      }
      );
    }

    return res.status(200).send("Dodano");
  } else {
    return res.status(403).send("Nie zalogowany");
  }
});

router.get("/getHistory", async (req, res) => {
  if(req.isAuthenticated()){
    res.json({history: await getHistory()});
  }
})

// router.get("/checkBreak", (req, res) => {
//   let json = JSON.parse(fs.readFileSync("./breaks.json")).breaks;
//   const time = new Date().toLocaleTimeString("pl-PL");

//   if (new Date().getDay() == 6 || new Date().getDay() == 0) {
//     return res.json({ isBreak: false });
//   }
//   if (time > json[0][0] && time < json[0][1]) {
//     return res.json({ isBreak: true });
//   } else if (time > json[1][0] && time < json[1][1]) {
//     return res.json({ isBreak: true });
//   } else if (time > json[2][0] && time < json[2][1]) {
//     return res.json({ isBreak: true });
//   } else if (time > json[3][0] && time < json[3][1]) {
//     return res.json({ isBreak: true });
//   } else if (time > json[4][0] && time < json[4][1]) {
//     return res.json({ isBreak: true });
//   } else if (time > json[5][0] && time < json[5][1]) {
//     return res.json({ isBreak: true });
//   } else if (time > json[6][0] && time < json[6][1]) {
//     return res.json({ isBreak: true });
//   } else if (time > json[7][0] && time < json[7][1]) {
//     return res.json({ isBreak: true });
//   } else if (time > json[8][0] && time < json[8][1]) {
//     return res.json({ isBreak: true });
//   }
//   return res.json({ isBreak: false });
// });


module.exports = router;
