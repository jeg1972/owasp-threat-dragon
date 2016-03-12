var express = require('express');
var router = express.Router();
var passport = require('passport');
var Strategy = require('passport-github').Strategy;

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

//serialisation/deserialisation of users
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//store the original location in the session and redirect to login
router.get('/login', function(req, res) {
    req.session.referer = req.query.loc ?  '/#' + req.query.loc : '/#/';
    res.redirect('/login/github');
    });

router.get('/logout',
function(req, res) {
    res.clearCookie('idp');
    //req.logOut();
    //logout does not seem to do much/anything so do it by hand
    res.clearCookie('connect.sid');
    req.session.destroy(function() { res.redirect('/'); 
        });
    }); 

router.get('/login/github', passport.authenticate('github'));  
    
router.get('/oauth/github', 
  passport.authenticate('github'),
  function(req, res) {
    var referer = req.session.referer;
    delete req.session.referer;
    res.cookie('idp', 'github', { httpOnly: false });
    res.redirect(referer || '/' );
  });
  
router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn('/login/github'),
  function(req, res){
    res.json(req.user);
  });

module.exports = router;

