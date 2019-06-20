/***
 * Excerpted from "Node.js 8 the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode2 for more book information.
***/
'use strict';
const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://localhost', {
  protocolId: 'MQTT',
  protocolVersion: 4
});

console.log('Connecting to broker...');
client.on('connect', () => {
  client.subscribe('changed');
  console.log('Connected.')
});

client.on('message', (topic, data) => {
  const message = JSON.parse(data);
  const date = new Date(message.timestamp);
  console.log(`File "${message.file}" changed at ${date}`);
});
