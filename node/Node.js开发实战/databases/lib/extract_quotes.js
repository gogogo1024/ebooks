/***
 * Excerpted from "Node.js 8 the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode2 for more book information.
***/
"use strict";

module.exports = text => text.split("\n") 
  .filter(line => line.startsWith("* ''"))
  .map(line => line.substr(2)
    .replace(/''+/g, "")                          // bold and italics
    .replace(/\[\[(.*?)\]\]/g,                    // wiki links
      ($0, $1) => $1.replace(/^[^\|]*\|/, ""))
    .replace(/<\/?[\w:]+[^>]*>/g, "")             // html tags
    .replace(/<!--.*?-->/g, ""));                 // html comments
