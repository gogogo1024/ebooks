// #!/usr/bin/env node --harmony
'use strict';
const express = require('express'),
	session = require('express-session'),
	logger = require('morgan'),
	RedisStore = require('connect-redis')(session),
	cookieParser = require('cookie-parser'),
	redisClient = require('redis').createClient(),
	app = express();
app.use(logger('short'));
app.use(cookieParser());
app.use(session({
	secret: 'unguessable',
	store: new RedisStore({
		client: redisClient
	})
}));
app.get('/api/:name', function(req, res) {
	res.json(200, {
		"hello": req.params.name
	});
});
app.listen(3000, function() {
	console.log("ready captain.");
});