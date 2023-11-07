const config = require("../config");
const router = require("express").Router();
const passport = require("passport");
const { default: mongoose, Error } = require("mongoose");
const { User } = require("../schemas");
const DiscordStrategy = require("passport-discord").Strategy;
const {getUsers} = require("./db");
const {admin, player} = require("../globals")


passport.use(
  new DiscordStrategy(
    {
      clientID: config.DISCORD_CLIENT_ID,
      clientSecret: config.DISCORD_CLIENT_SECRET,
      callbackURL: config.CALLBACK_URL,
      scope: ['identify']
    },
    function (accessToken, refreshToken, profile, done) {
      // return done(console.log(profile));
      User.findOne({ discordId: profile.id }, function (err, user) {
        if (err) {
          return done(err);
        }

        if (user) {
          // The user is already in db
          return done(null, profile);
        } else {
          // The user is not in db, so save him
          let newUser = new User({
            discordId: profile.id,
            username: profile.username,
            avatar: profile.avatar,
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

passport.deserializeUser((user, done) => {
  process.nextTick(function () {
    done(null, user);
  });
});

router.get("/", passport.authenticate("discord"));

router.get(
  "/callback",
  passport.authenticate("discord", { failureRedirect: config.FRONTEND_HOST }),
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
