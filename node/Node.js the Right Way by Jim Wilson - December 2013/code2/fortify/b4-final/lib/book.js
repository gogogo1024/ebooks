/***
 * Excerpted from "Node.js 8 the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode2 for more book information.
***/
/**
 * Provides API endpoints for searching the books index.
 */
'use strict';
const express = require('express');
const rp = require('request-promise');

module.exports = es => {

  const url = `http://${es.host}:${es.port}/${es.books_index}/book/_search`;

  const router = express.Router();

  /**
   * Search for books by matching a particular field value.
   * Example: /api/search/books/authors/Twain
   */
  router.get('/search/books/:field/:query', async (req, res) => {
    const esReqBody = {
      size: 10,
      query: {
        match: {
          [req.params.field]: req.params.query
        }
      },
    };

    try {
      const esResBody = await rp({url, json: true, body: esReqBody});
      const results = esResBody.hits.hits.map(hit => hit._source);
      res.status(200).json(results);
    } catch (esResErr) {
      res.status(esResErr.statusCode || 502).json(esResErr.error);
    }
  });

  /**
   * Retrieve a given book.
   */
  router.get('/book/:id', async (req, res) => {
    const bookUrl =
      `http://${es.host}:${es.port}/${es.books_index}` +
      `/book/${req.params.id}`;
    try {
      const {_source: book} = await rp({url: bookUrl, json: true});
      res.status(200).json(book);
    } catch (esResErr) {
      res.status(esResErr.statusCode || 502).json(esResErr.error);
    }
  });

  /**
   * Collect suggested terms for a given field based on a given query.
   * Example: /api/suggest/authors/lipman
   */
  router.get('/suggest/:field/:query', async (req, res) => {
    const esReqBody = {
      size: 0,
      suggest: {
        suggestions: {
          text: req.params.query,
          term: {
            field: req.params.field,
            suggest_mode: 'always',
          },
        }
      }
    };

    try {
      const {suggest} = await rp({url, json: true, body: esReqBody});
      res.status(200).json(suggest.suggestions);
    } catch (esResErr) {
      res.status(esResErr.statusCode || 502).json(esResErr.error);
    }
  });

  return router;
};
