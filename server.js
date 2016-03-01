﻿#!/usr/bin/env node
var debug = require('debug')('ThreatDragon');
var app = require('./td/app');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});
