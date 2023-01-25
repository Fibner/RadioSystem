const router = require("express").Router();
const config = require("../config");
const passport = require("passport")

router.use(passport.initialize());
router.use(passport.session());
router.get("/auth", (req, res) => {
  if (req.isAuthenticated()) {
    ////console.log("przeszło");
    res.status(200)
    .json({
      user: req.user,
      cookies: req.cookies,
    });
  } else {
    ////console.log("odrzucono");
    // res.status(403).send();
    res.redirect("http://localhost:3000");
    ////.redirect(`${config.FRONTEND_HOST}`);
  }
});

module.exports = router;
