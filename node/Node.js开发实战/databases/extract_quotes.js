/***
 * Excerpted from "Node.js 8 the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode2 for more book information.
***/
"use strict";

const
  async = require("async"),
  rp = require("request-promise"),
  errors = require("request-promise/errors"),

  pageStream = require("./lib/page_stream.js").createStream(),
  extractQuotes = require("./lib/extract_quotes.js"),

  /*/
  uploadQueue = async.queue((doc, done) => {
    let options = {
      method: "PUT",
      uri: `http://localhost:9200/quotes/${doc.page_id}/${doc.index}`,
      body: doc,
      json: true
    };
    rp(options)
      .then(res => console.log(res))
      .then(done)
      .catch(err => { throw err; });
  }, 1000);
  //*/
  //*/
  uploadQueue = {
    push: (doc) => {
      let options = {
        method: "PUT",
        uri: `http://localhost:9200/quotes/${doc.page_id}/${doc.index}`,
        body: doc,
        json: true,
        resolveWithFullResponse: true
      };
      rp(options)
        .then(res => console.log(JSON.stringify(res)))
        .catch(errors.StatusCodeError, reason => {
          console.log(JSON.stringify(reason.response));
          // Hammer time!
          uploadQueue.push(doc);
        })
        .catch(errors.RequestError, reason => {
          console.log(JSON.stringify(reason));
          process.exit(1);
        })
    }
  };
  //*/
  /*/
  uploadQueue = {
    push: (doc) => {
      console.log(JSON.stringify(doc));
    }
  };
  //*/

pageStream.on("page", page => {
  if (page.ns) {
    return;
  }
  extractQuotes(page.text)
    .forEach((text, index) =>
      uploadQueue.push({
        page_id: page.id,
        index,
        title: page.title,
        text
      }))
});

process.stdin.pipe(pageStream);


/*
const
  sax = require("sax"),
  saxStream = sax.createStream(true),
  stack = [];

let page = null;

saxStream
  .on("opentag", node => {
    let tag = node.name;
    stack.push(tag);
    if (tag === "page") {
      page = { title: "", ns: "", id: "", text: "", sha1: "" };
    }
  })
  .on("text", text => {
    let tag = stack[stack.length - 1];
    if ( (stack.length === 3 && (tag === "title" || tag === "ns" || tag === "id")) ||
         (stack.length === 4 && (tag === "text" || tag === "sha1")) ) {
      page[tag] += text;
    }
  })
  .on("closetag", node => {
    let tag = stack.pop();
    if (tag !== "page") { return; }
    page.id = +page.id;
    page.ns = +page.ns;
    if (page.ns || page.text.substr(0, 12) === "#REDIRECT [[") { return; }
    let quotes = [];
    page.text.split("\n").forEach(line => {
      if (line.substr(0, 4) === "* ''") {
        let text = line.substr(2)
          .replace(/''+/g, '')                          // bold and italics
          .replace(/\[\[(.*?)\]\]/g,                    // wiki links
            ($0, $1) => $1.replace(/^[^\|]*\|/, ''))
          .replace(/<\/?[\w:]+[^>]*>/g, '')             // html tags
          .replace(/<!--.*?-->/g, '');                  // html comments
        quotes.push({
          key: [ page.id, quotes.length ],
          title: page.title,
          text: text
        });
      }
    });
    quotes.forEach(quote => { console.log(quote); });
  });

process.stdin.pipe(saxStream);

*/

/*
 * OPEN [ 'mediawiki', 'page' ]
 * OPEN [ 'mediawiki', 'page', 'title' ]
 * CLOSE [ 'mediawiki', 'page', 'title' ]
 * OPEN [ 'mediawiki', 'page', 'ns' ]
 * CLOSE [ 'mediawiki', 'page', 'ns' ]
 * OPEN [ 'mediawiki', 'page', 'id' ]
 * CLOSE [ 'mediawiki', 'page', 'id' ]
 * OPEN [ 'mediawiki', 'page', 'revision' ]
 * OPEN [ 'mediawiki', 'page', 'revision', 'id' ]
 * CLOSE [ 'mediawiki', 'page', 'revision', 'id' ]
 * OPEN [ 'mediawiki', 'page', 'revision', 'parentid' ]
 * CLOSE [ 'mediawiki', 'page', 'revision', 'parentid' ]
 * OPEN [ 'mediawiki', 'page', 'revision', 'timestamp' ]
 * CLOSE [ 'mediawiki', 'page', 'revision', 'timestamp' ]
 * OPEN [ 'mediawiki', 'page', 'revision', 'contributor' ]
 * OPEN [ 'mediawiki', 'page', 'revision', 'contributor', 'username' ]
 * CLOSE [ 'mediawiki', 'page', 'revision', 'contributor', 'username' ]
 * OPEN [ 'mediawiki', 'page', 'revision', 'contributor', 'id' ]
 * CLOSE [ 'mediawiki', 'page', 'revision', 'contributor', 'id' ]
 * CLOSE [ 'mediawiki', 'page', 'revision', 'contributor' ]
 * OPEN [ 'mediawiki', 'page', 'revision', 'minor' ]
 * CLOSE [ 'mediawiki', 'page', 'revision', 'minor' ]
 * OPEN [ 'mediawiki', 'page', 'revision', 'comment' ]
 * CLOSE [ 'mediawiki', 'page', 'revision', 'comment' ]
 * OPEN [ 'mediawiki', 'page', 'revision', 'model' ]
 * CLOSE [ 'mediawiki', 'page', 'revision', 'model' ]
 * OPEN [ 'mediawiki', 'page', 'revision', 'format' ]
 * CLOSE [ 'mediawiki', 'page', 'revision', 'format' ]
 * OPEN [ 'mediawiki', 'page', 'revision', 'text' ]
 * CLOSE [ 'mediawiki', 'page', 'revision', 'text' ]
 * OPEN [ 'mediawiki', 'page', 'revision', 'sha1' ]
 * CLOSE [ 'mediawiki', 'page', 'revision', 'sha1' ]
 * CLOSE [ 'mediawiki', 'page', 'revision' ]
 * CLOSE [ 'mediawiki', 'page' ]
 */

