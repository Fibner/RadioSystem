const config = require("../config");
const router = require("express").Router();
const passport = require("passport");
const { default: mongoose, Error } = require("mongoose");
const { User } = require("../schemas");
const FacebookStrategy = require("passport-facebook").Strategy;
const {getUsers} = require("./db");
const {admin, player} = require("../globals")


passport.use(
  new FacebookStrategy(
    {
      clientID: config.FACEBOOK_CLIENT_ID,
      clientSecret: config.FACEBOOK_CLIENT_SECRET,
      callbackURL: `http://localhost:4999/facebook/callback`,
      profileFields: ["id", "first_name", "displayName", "picture"]
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ facebookId: profile.id }, function (err, user) {
        if (err) {
          return done(err);
        }

        if (user) {
          // Użytkownik już istnieje w bazie danych
          return done(null, profile);
        } else {
          // Użytkownik nie istnieje, więc zapisz go do bazy danych
          let newUser = new User({
            facebookId: profile.id,
            name: profile.displayName,
            picture_url: profile.photos[0].value,
            authorizationDate: new Date()
          });
          newUser.save(async function (err) {
            if (err) {
              return done(err);
            }
            if(admin.ws) admin.ws.send(JSON.stringify({users: await getUsers()}));
            return done(null, profile);
          });
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  process.nextTick(function () {
    done(null, user);
  });
});

passport.deserializeUser((obj, done) => {
  process.nextTick(function () {
    done(null, obj);
  });
});

router.get("/", passport.authenticate("facebook"));

router.get(
  "/callback",
  passport.authenticate("facebook", { failureRedirect: config.FRONTEND_HOST }),
  function (req, res) {
    // Pomyślne logowanie
    res.redirect(config.FRONTEND_HOST+"/add");
  }
);

router.get("/logout", function (req, res) {
  req.logout(() => {
    res.json({
      loggedOut: true,
    });
    // res.redirect(`${config.FRONTEND_HOST}`);
  });
});

module.exports = router;
