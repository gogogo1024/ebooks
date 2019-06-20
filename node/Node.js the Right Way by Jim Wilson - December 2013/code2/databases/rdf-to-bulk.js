/***
 * Excerpted from "Node.js 8 the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode2 for more book information.
***/
'use strict';

const dir = require('node-dir');
const parseRDF = require('./lib/parse-rdf.js');

const dirname = process.argv[2];

const options = {
  match: /\.rdf$/,       // Match file names that in '.rdf'.
  exclude: ['pg0.rdf'],  // Ignore the template RDF file (ID = 0).
};

dir.readFiles(dirname, options, (err, content, next) => {
  if (err) throw err;
  const doc = parseRDF(content);
  console.log(JSON.stringify({ index: { _id: `pg${doc.id}` } }));
  console.log(JSON.stringify(doc));
  next();
});

process.stdout.on('error', err => process.exit());
