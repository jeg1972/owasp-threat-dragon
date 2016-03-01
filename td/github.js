var request = require('request');
var github = {};

github.repos = function(req, res) {
    
    var reposUrl = req.user.profile._json.repos_url;
    var accessToken = req.user.accessToken;
    var reposRequest = request.get(reposUrl, { headers: {'User-Agent': 'OWASP Threat Dragon'}}).auth(null, null, true, accessToken);
    
    
    reposRequest.pipe(res);
}

module.exports = github;