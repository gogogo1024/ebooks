"use strict"
const
	net = require('net'),
	ldj = require('./ldj.js'),
	netClient = net.connect({
		port: 5432
	}),

	ldjClient = ldj.connect(netClient);
ldjClient.on('message', function(message) {
	if (message.type === 'watching') {
		console.log('Now watching: ' + message.file);

	} else if (message.type === 'changed') {
		console.log('File ' + message.file + ' changed at ' + Date.now());
	} else {
		throw Error("Unrecognized message type: " + message.type);
	}
});
ldjClient.on('JsonParseError',function (message) {
	console.log(message);
})
	console.dir(netClient);