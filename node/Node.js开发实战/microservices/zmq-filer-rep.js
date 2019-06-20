/***
 * Excerpted from "Node.js 8 the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode2 for more book information.
***/
'use strict';
const fs = require('fs');
const zmq = require('zeromq');

// Socket to reply to client requests.
const responder = zmq.socket('rep');

// Handle incoming requests.
responder.on('message', data => {
  
  // Parse the incoming message.
  const request = JSON.parse(data);
  console.log(`Received request to get: ${request.path}`);
  
  // Read the file and reply with content.
  fs.readFile(request.path, (err, content) => {
    console.log('Sending response content.');
    responder.send(JSON.stringify({
      content: content.toString(),
      timestamp: Date.now(),
      pid: process.pid
    }));
  });
  
});

// Listen on TCP port 60401.
responder.bind('tcp://127.0.0.1:60401', err => {
  console.log('Listening for zmq requesters...');
});

// Close the responder when the Node process ends.
process.on('SIGINT', () => {
  console.log('Shutting down...');
  responder.close();
});

