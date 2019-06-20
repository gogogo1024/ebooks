/***
 * Excerpted from "Node.js 8 the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode2 for more book information.
***/
const rp = require('request-promise');
rp({
  method: process.argv[2] || 'GET',
  uri: `http://localhost:9200/${process.argv[3]}`,
  json: true,
  resolveWithFullResponse: true,
  simple: false
}).then(res => console.log(res.statusCode, res.body));
