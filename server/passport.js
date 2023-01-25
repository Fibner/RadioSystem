const passport = require("passport");
const Strategy = require("passport-facebook").Strategy;

passport.use(
    new Strategy(
      {
        clientID: config.FACEBOOK_CLIENT_ID,
        clientSecret: config.FACEBOOK_CLIENT_SECRET,
        callbackURL: "/facebook/callback",
      },
      function (accessToken, refreshToken, profile, cb) {
        // save the profile on the Database
        // Save the accessToken and refreshToken if you need to call facebook apis later on
        return cb(null, profile);
      }
    )
  );
  
  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });