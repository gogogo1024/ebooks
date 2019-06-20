#!/usr/bin/env node --harmony

'use strict';

const
	express = require('express'),
	morgan = require('morgan'),
	app = express();
app.use(morgan('short'));
app.get('/api/:name', function(req, res) {

	res.status(200).json({
		"hello": req.params.name
	})
});
app.listen(3000, function() {
	console.log("ready captain.");
});