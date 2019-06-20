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
const mqtt = require('mqtt');
const filename = process.argv[2];

const client = mqtt.connect('mqtt://localhost', {
  protocolId: 'MQTT',
  protocolVersion: 4
});

fs.watch(filename, () => {
  console.log('Sending changed message.');
  client.publish('changed', JSON.stringify({
    file: filename,
    timestamp: Date.now()
  }));
});

console.log('Connecting to broker...');
client.on('connect', () => console.log('Connected.'));
