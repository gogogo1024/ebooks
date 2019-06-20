/***
 * Excerpted from "Node.js 8 the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode2 for more book information.
***/
'use strict';

const stream = require('stream');
const sax = require('sax');

class PageStream extends stream.Writable {
  constructor() {

    super();

    let stack = [];
    let page = null;

    this.saxStream = sax.createStream(true)
      .on('opentag', node => {
        const tag = node.name;
        stack.push(tag);
        if (tag === 'page') {
          page = { title: '', ns: '', id: '', text: '', sha1: '' };
        }
      })
      .on('text', text => {
        const tag = stack[stack.length - 1];
        if ( (stack.length === 3 && (tag === 'title' || tag === 'ns' || tag === 'id')) ||
             (stack.length === 4 && (tag === 'text' || tag === 'sha1')) ) {
          page[tag] += text;
        }
      })
      .on('closetag', node => {
        const tag = stack.pop();
        if (tag === 'page' && !+page.ns) {
          page.id = +page.id;
          this.emit('page', page);
        }
      })
      .on('error', err => this.emit('error', err));
  }

  _write(chunk, encoding, next) {
    this.saxStream.write(chunk) && next();
  }
}

module.exports = {
  PageStream,
  createStream: () => new PageStream(),
};


/*
 * <mediawiki>
 *   <page>
 *     <title></title>
 *     <ns></ns>
 *     <id></id>
 *     <revision>
 *       <text></text>
 *       <sha1></sha1>
 *     </revision>
 *   </page>
 * </mediawiki>
 */

