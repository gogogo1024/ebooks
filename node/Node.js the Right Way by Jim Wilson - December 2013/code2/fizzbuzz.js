/***
 * Excerpted from "Node.js 8 the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode2 for more book information.
***/
'use strict';
const list = [...Array(100).keys()]
  .map(n => 'x'.repeat(n + 1)).join()
  .replace(/,(x{15})+(?!x)/g, ',FizzBuzz')
  .replace(/,(x{5})+(?!x)/g, ',Buzz')
  .replace(/,(x{3})+(?!x)/g, ',Fizz')
  .replace(/x+/g, x => x.length)
  .replace(/,/g, '\n');
console.log(list);
