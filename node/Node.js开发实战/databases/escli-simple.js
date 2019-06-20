#!/usr/bin/env node
/***
 * Excerpted from "Node.js 8 the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode2 for more book information.
***/
'use strict';

const request = require('superagent');
const method = process.argv[2] || 'GET';
const path = process.argv[3] || '';

request(method, `http://localhost:9200/${path}`)
  .end((err, res) => {
    if (err && !res) {
      throw err;
    }
    console.log(res.statusCode, res.body);
  });
