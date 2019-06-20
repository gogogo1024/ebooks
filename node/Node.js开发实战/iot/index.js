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
const colors = require('colors/safe');

const ambientPub = require('./lib/ambient-pub.js');

const RED = 0;

function reportError(err) {
  tessel.led[RED].on();
  console.log(colors.red('ERR!'), err);
}

function createClient() {
  return new Promise((fulfill, reject) => {
    // Fill in your own broker's address.
    const client = mqtt.connect('mqtt://192.168.1.171', {
      protocolId: 'MQIsdp',
      protocolVersion: 3
    });
    client.on('error', reject);
    client.on('connect', () => fulfill(client));
  });
}

Promise.all([ambientPub(tessel.port.A)])
  .then(([ambient]) => {
    return createClient().then(client => [ambient, client]);
  })
  .then(([ambient, client]) => {

  })
  .catch(err => reportError);
