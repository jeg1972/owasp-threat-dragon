var express = require('express');
var passport = require('passport');
var router = express.Router();
var github = require('../github');

//github repos
router.get('/github/repos', function (req, res) {
    github.repos(req, res);
});

module.exports = router;
