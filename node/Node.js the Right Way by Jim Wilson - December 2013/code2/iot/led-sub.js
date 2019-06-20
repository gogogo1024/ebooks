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

const RED = 0, GREEN = 2, BLUE = 3;

tessel.led[RED].off();
tessel.led[BLUE].off();
tessel.led[GREEN].off();

// Fill in your own broker's address.
const client = mqtt.connect('mqtt://192.168.1.171', {
  protocolId: 'MQIsdp',
  protocolVersion: 3
});

console.log(colors.gray('READY'));
client.on('connect', () => {
  client.subscribe('led');
  console.log(colors.green('CONNECTED'));
});

client.on('message', (topic, data) => {
  try {
    const msg = JSON.parse(data);

    if (msg.color !== 'blue' && msg.color !== 'green') {
      throw Error(`Unrecognized LED color: ${msg.color}`);
    }

    if (['on', 'off', 'toggle'].indexOf(msg.command) === -1) {
      throw Error(`Unrecognized LED command: ${msg.command}`);
    }

    // Call the indicated command on the chosen LED and log same to console.
    const index = msg.color === 'blue' ? BLUE : GREEN;
    tessel.led[index][msg.command]();
    console.log(colors[msg.color](msg.color.toUpperCase()), msg.command);

    tessel.led[RED].off();
  } catch (err) {
    tessel.led[RED].on();
    console.log(colors.red('ERR!'), err);
  }
});
