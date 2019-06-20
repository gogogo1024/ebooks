/***
 * Excerpted from "Node.js 8 the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode2 for more book information.
***/
module.exports = {
  title: {
    by_word: {
      map: function(doc) {
        doc.title
          .split(/\b/)
          .filter(function(word) { return (/\w/).test(word); })
          .map(String.toLowerCase)
          .forEach(function(word) { emit(word, doc.title); });
      },
      reduce: "_count"
    }
  },
  quote: {
    by_title: {
      map: function(doc) {
        emit(doc.title, null);
      },
      reduce: "_count"
    },
    by_word: {
      map: function(doc) {
        doc.text
          .split(/\b/)
          .filter(function(word) { return word.length > 4; })
          .filter(function(word) { return (/[0-9a-zA-Z]/).test(word); })
          .map(String.toLowerCase)
          .sort()
          .filter(function(word, index, self) { return self.indexOf(word) === index; })
          .forEach(function(word) { emit(word, null); });
      },
      reduce: "_count"
    }
  }
};

