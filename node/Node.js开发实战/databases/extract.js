/***
 * Excerpted from "Node.js 8 the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode2 for more book information.
***/
'use strict';

const pageStream = require('./lib/page_stream.js').createStream();
const extractQuotes = require('./lib/extract_quotes.js');

pageStream.on('page', page => {
  extractQuotes(page.text).forEach((text, index) => {
    console.log(JSON.stringify({
      index: {
        _id: `${page.id}-${index}`
      }
    }));
    console.log(JSON.stringify({
      page_id: page.id,
      index,
      title: page.title,
      text
    }));
  });
});

process.stdin.pipe(pageStream);
