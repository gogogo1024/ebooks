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
const ambientlib = require('ambient-attx4');

const ambient = ambientlib.use(tessel.port.A);

const RED = 0;

let client = null;

function reportError(err) {
  tessel.led[RED].on();
  console.log(colors.red('ERR!'), err);
}

function reportLightLevel() {
  tessel.led[RED].off();
  ambient.getLightLevel((err, data) => {
    if (err) {
      reportError(err);
    } else {
      client.publish('light', data.toString());
    }
    setTimeout(reportLightLevel, 500);
  });
}

ambient.on('error', reportError);

ambient.on('ready', () => {
  console.log(colors.gray('READY'));

  // Fill in your own broker's address.
  client = mqtt.connect('mqtt://192.168.1.171', {
    protocolId: 'MQIsdp',
    protocolVersion: 3
  });

  client.on('connect', () => {
    console.log(colors.green('CONNECTED'));
    reportLightLevel();
  });
});
