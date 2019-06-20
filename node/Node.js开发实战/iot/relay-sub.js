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
const relaylib = require('relay-mono');

const relay = relaylib.use(tessel.port.B);  

const RED = 0;

function reportError(err) {  
  tessel.led[RED].on();
  console.log(colors.red('ERR!'), err);
}

relay.on('error', reportError);
relay.on('ready', () => {  
  console.log(colors.gray('READY'));

  // Fill in your own broker's address.
  const client = mqtt.connect('mqtt://192.168.1.171', {
    protocolId: 'MQIsdp',
    protocolVersion: 3
  });

  client.on('connect', () => {
    console.log(colors.green('CONNECTED'));
    client.subscribe('relay');
  });

  client.on('message', (topic, data) => {  
    try {
      const msg = JSON.parse(data);

      if (msg.number !== 1 && msg.number !== 2) {
        throw Error(`Unrecognized relay number: ${msg.number}`);
      }

      if (['turnOn', 'turnOff', 'toggle'].indexOf(msg.command) === -1) {
        throw Error(`Unrecognized relay command: ${msg.command}`);
      }

      relay[msg.command](msg.number, (err) => {  
        if (err) {
          reportError(err);
        }
      });
    } catch (err) {
      reportError(err);
    }
  });
});
