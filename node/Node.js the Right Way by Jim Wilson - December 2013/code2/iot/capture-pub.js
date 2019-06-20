/***
 * Excerpted from "Node.js 8 the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode2 for more book information.
***/
'use strict';
const tessel = require('tessel');
const mqtt = require('mqtt');
const av = require('tessel-av');

const camera = new av.Camera();

// Fill in your own broker's address.
const client = mqtt.connect('mqtt://192.168.1.171', {
  protocolId: 'MQIsdp',
  protocolVersion: 3
});

client.on('connect', () => {
  console.log('CONNECTED');
  captureAndPublish();
});

function captureAndPublish() {
  // Extract captured data and publish on the capture topic.
  // After 1000 ms, call captureAndPublish() again.
}
