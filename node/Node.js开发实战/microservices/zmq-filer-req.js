/***
 * Excerpted from "Node.js 8 the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode2 for more book information.
***/
'use strict';
const zmq = require('zeromq');
const filename = process.argv[2];

// Create request endpoint.
const requester = zmq.socket('req');

// Handle replies from the responder.
requester.on('message', data => {
  const response = JSON.parse(data);
  console.log('Received response:', response);
});

requester.connect('tcp://localhost:60401');

// Send a request for content.
console.log(`Sending a request for ${filename}`);
requester.send(JSON.stringify({ path: filename }));
