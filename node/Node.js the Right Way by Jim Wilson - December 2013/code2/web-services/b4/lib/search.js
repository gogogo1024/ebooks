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
const request = require('request');
const rp = require('request-promise');
module.exports = (app, es) => {

  const url = `http://${es.host}:${es.port}/${es.books_index}/book/_search`;

  /**
   * Search for books by matching a particular field value.
   * Example: /api/search/books/authors/Twain
   */
  app.get('/api/search/books/:field/:query', (req, res) => {

    const esReqBody = {
      size: 10,
      query: {
        match: {
          [req.params.field]: req.params.query
        }
      },
    };

    const options = {url, json: true, body: esReqBody};
    request.get(options, (err, esRes, esResBody) => {

      if (err) {
        res.status(502).json({
          error: 'bad_gateway',
          reason: err.code,
        });
        return;
      }

      if (esRes.statusCode !== 200) {
        res.status(esRes.statusCode).json(esResBody);
        return;
      }

      res.status(200).json(esResBody.hits.hits.map(({_source}) => _source));
    });

  });

  /**
   * Collect suggested terms for a given field based on a given query.
   * Example: /api/suggest/authors/lipman
   */
  app.get('/api/suggest/:field/:query', (req, res) => {

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

    const options = {url, json: true, body: esReqBody};

    const promise = new Promise((resolve, reject) => {
      request.get(options, (err, esRes, esResBody) => {

        if (err) {
          reject({error: err});
          return;
        }

        if (esRes.statusCode !== 200) {
          reject({error: esResBody});
          return;
        }

        resolve(esResBody);
      });
    });

    promise
      .then(esResBody => res.status(200).json(esResBody.suggest.suggestions))
      .catch(({error}) => res.status(error.status || 502).json(error));

    /*
    rp({url, json: true, body: esReqBody})
      .then(esResBody => res.status(200).json(esResBody.suggest.suggestions))
      .catch(({error}) => res.status(error.status || 502).json(error));
    */
// STARt:suggest-field
  });

  app.get('/api/search/field/:field/:query', (req, res) => {

    const esReqBody = {
      size: 1000,
      query: {
        match_phrase_prefix: {
          [req.params.field]: req.params.query,
        },
      },
    };

    rp({url, json: true, body: esReqBody})
      .then(esResBody => {
        // Collect results.
        const query = req.params.query.toLowerCase();
        const results = new Set();
        esResBody.hits.hits.forEach(({_source}) => {
          const values = _source[req.params.field];
          if (values) {
            (Array.isArray(values) ? values : [values]).forEach(value => {
              if (value.toLowerCase().includes(query)) {
                results.add(value);
              }
            });
          }
        });

        res.status(200).json([...results].sort());
      })
      .catch(({error}) => res.status(error.status || 502).json(error));

  });
};
