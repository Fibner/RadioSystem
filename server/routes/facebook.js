const config = require("../config");
const router = require("express").Router();
const passport = require("passport");
const { use } = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new FacebookStrategy(
    {
      clientID: config.FACEBOOK_CLIENT_ID,
      clientSecret: config.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/facebook/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      // console.log(profile);
      // save the profile on the Database
      // Save the accessToken and refreshToken if you need to call facebook apis later on
      cb(null, profile);
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

router.use(passport.initialize());
router.use(passport.session());

router.get("/", passport.authenticate("facebook"));

router.get(
  "/callback",
  passport.authenticate("facebook", {
    successRedirect: `${config.FRONTEND_HOST}/add`,
    failureRedirect: "error",
  })
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(`${config.FRONTEND_HOST}`);
  });
});

// passport.serializeUser(function (user, cb) {
//     process.nextTick(()=>{
//         console.log(user);
//         cb(null, {id: user.id, username: user.username, name: user.name});
//     })
// });

// passport.deserializeUser(function (obj, cb) {
//     process.nextTick(()=>{
//         return cb(null, obj);
//     })
// });

module.exports = router;
