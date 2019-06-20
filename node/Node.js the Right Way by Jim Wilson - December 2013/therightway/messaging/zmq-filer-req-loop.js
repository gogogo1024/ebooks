"use strict";
const
	zmq = require('zmq'),
	filename = process.argv[2],
	// create request endpoint
	requester = zmq.socket('req');
// handle replies from responder
requester.on("message", function(data) {
	let response = JSON.parse(data);
	console.log("Received response:", response);
});
requester.connect("tcp://localhost:5433");
// send request for content
//loop

for (let i = 1; i <= 8; i++) {
	console.log('Sending request ' + i + ' for ' + filename);
	requester.send(JSON.stringify({
		path: filename
	}));
}