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

// Create subscriber endpoint.
const subscriber = zmq.socket('sub');

// Subscribe to all messages.
subscriber.subscribe('');

// Handle messages from the publisher.
subscriber.on('message', data => {
  const message = JSON.parse(data);
  const date = new Date(message.timestamp);
  console.log(`File "${message.file}" changed at ${date}`);
});

// Connect to publisher.
subscriber.connect("tcp://localhost:60400");
