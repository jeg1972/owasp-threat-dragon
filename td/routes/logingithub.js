var express = require('express');
var router = express.Router();
var passport = require('passport');
var Strategy = require('passport-github').Strategy;

//github sigin
passport.use(new Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/oauth/github'
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, {profile: profile, accessToken: accessToken});
  }));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

router.get('/login/github',
  passport.authenticate('github', { failureRedirect: '/login/github', scope: [ 'user:email','repo' ] }));

router.get('/oauth/github', 
  passport.authenticate('github', { failureRedirect: '/login/github', scope: [ 'user:email','repo' ] }),
  function(req, res) {
    //todo - validate referer before redirecting
    res.redirect('/');
  });
  
router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn('/login/github'),
  function(req, res){
    res.json(req.user);
  });

module.exports = router;

