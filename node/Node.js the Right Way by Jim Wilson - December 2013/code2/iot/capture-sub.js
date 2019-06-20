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
const fs = require('fs');

// Fill in your own broker's address.
const client = mqtt.connect('mqtt://192.168.1.171', {
  protocolId: 'MQIsdp',
  protocolVersion: 3
});

client.on('connect', () => {
  console.log('CONNECTED');
  client.subscribe('capture');
});

let writing = false;
client.on('message', (topic, data) =>  {
  if (writing) {
    console.log('TOO FAST');
    return;
  }
  console.log('BEGIN WRITING');
  writing = true;
  fs.writeFile('capture.jpg', data, err => {
    if (err) {
      throw err;
    }
    writing = false;
    console.log('DONE WRITING');
  });
});
