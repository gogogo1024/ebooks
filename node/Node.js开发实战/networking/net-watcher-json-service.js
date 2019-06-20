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
const net = require('net');
const filename = process.argv[2];

if (!filename) {
  throw Error('Error: No filename specified.');
}

net.createServer(connection => {
  // reporting
  console.log('Subscriber connected.');
  connection.write(JSON.stringify({type: 'watching', file: filename}) + '\n');
    
  // watcher setup
  const watcher = fs.watch(filename, () => connection.write(
    JSON.stringify({type: 'changed', timestamp: Date.now()}) + '\n'));
    
  // cleanup
  connection.on('close', () => {
    console.log('Subscriber disconnected.');
    watcher.close();
  });
}).listen(60300, () => console.log('Listening for subscribers...'));

