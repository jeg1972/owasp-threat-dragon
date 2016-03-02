var express = require('express');
var router = express.Router();
var passport = require('passport');
var Strategy = require('passport-github').Strategy;
var referer;

//github sigin
passport.use(new Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/oauth/github',
    failureRedirect: 'login/github',
    scope: [ 'user:email','repo' ]
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

router.get('/login',
function(req, res) { 
    referer = req.query.loc ?  '/#' + req.query.loc : '/#/';
    res.redirect('/login/github');
    }); 

router.get('/login/github', passport.authenticate('github'));  
    
router.get('/oauth/github', 
  passport.authenticate('github'),
  function(req, res) {
    res.redirect(referer);
  });
  
router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn('/login/github'),
  function(req, res){
    res.json(req.user);
  });

module.exports = router;

