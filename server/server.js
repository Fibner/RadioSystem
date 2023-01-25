const express = require("express");
const app = express();
const port = 4999;
const config = require("./config");
const facebookRouter = require("./routes/facebook");
const apiRouter = require("./routes/api");
const cors = require("cors");

// app.use(cors());
app.use(cors({ origin: `http://localhost:3000`, credentials: true, methods: 'GET', }));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.send("Server OK");
});

app.use("/facebook", facebookRouter);
app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});

// app.get("*", (req, res)=>{
//   res.redirect(`${config.FRONTEND_HOST}`);
// })
