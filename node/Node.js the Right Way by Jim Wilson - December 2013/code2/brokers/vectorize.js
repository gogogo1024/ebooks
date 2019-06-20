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
const PNG = require('pngjs').PNG;
const ImageTracer = require('imagetracerjs');
const infile = process.argv[2];
const outfile = process.argv[3];

if (!infile || !outfile) {
  throw Error('vectorize takes two arguments: an input and an output file');
}

fs.createReadStream(infile)
  .pipe(new PNG({
    filterType: 4
  }))
  .on('parsed', function() {

    const options = {
      ltres: 1
    };
    const svg = ImageTracer.imagedataToSVG(this, options);

    fs.writeFile(outfile, svg, err => {
      if (err) throw err;
    }); 
  });


