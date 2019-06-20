/***
 * Excerpted from "Node.js 8 the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode2 for more book information.
***/
/**
 * Provides API endpoints for working with book bundles.
 */
'use strict';
const express = require('express');
const rp = require('request-promise');

const getUserKey = ({user:{provider, id}}) => `${provider}-${id}`;

module.exports = es => {
  const url = `http://${es.host}:${es.port}/${es.bundles_index}/bundle`;

  const router = express.Router();

  /**
   * All of these APIs require the user to have authenticated.
   */
  router.use((req, res, next) => {
    if (!req.isAuthenticated()) {
      res.status(403).json({
        error: 'You must sign in to use this service.',
      });
      return;
    }
    next();
  });

  /**
   * List bundles for the currently authenticated user.
   */
  router.get('/list-bundles', async (req, res) => {
    try {
      const esReqBody = {
        size: 1000,
        query: {
          match: {
            userKey: getUserKey(req),
          }
        },
      };

      const options = {
        url: `${url}/_search`,
        json: true,
        body: esReqBody,
      };

      const esResBody = await rp(options);
      const bundles = esResBody.hits.hits.map(hit => ({
        id: hit._id,
        name: hit._source.name,
      }));
      res.status(200).json(bundles);
    } catch (err) {
      res.status(err.statusCode || 502).json(err.error || err);
    }
  });

  /**
   * Create a new bundle with the specified name.
   */
  router.post('/bundle', async (req, res) => {
    try {
      const bundle = {
        name: req.query.name || '',
        userKey: getUserKey(req),
        books: [],
      };

      const esResBody = await rp.post({url, body: bundle, json: true});
      res.status(201).json(esResBody);
    } catch (err) {
      res.status(err.statusCode || 502).json(err.error || err);
    }
  });

  /**
   * Retrieve a given bundle.
   */
  router.get('/bundle/:id', async (req, res) => {
    try {
      const options = {
        url: `${url}/${req.params.id}`,
        json: true,
      };

      const {_source: bundle} = await rp(options);

      if (bundle.userKey !== getUserKey(req)) {
        throw {
          statusCode: 403,
          error: 'You are not authorized to view this bundle.',
        };
      }

      res.status(200).json({id: req.params.id, bundle});
    } catch (err) {
      res.status(err.statusCode || 502).json(err.error || err);
    }
  });


  /**
   * Set the specified bundle's name with the specified name.
   */
  router.put('/bundle/:id/name/:name', async (req, res) => {
    try {
      const bundleUrl = `${url}/${req.params.id}`;

      const {_source: bundle} = await rp({url: bundleUrl, json: true});

      if (bundle.userKey !== getUserKey(req)) {
        throw {
          statusCode: 403,
          error: 'You are not authorized to modify this bundle.',
        };
      }

      bundle.name = req.params.name;

      const esResBody =
        await rp.put({url: bundleUrl, body: bundle, json: true});
      res.status(200).json(esResBody);
    } catch (err) {
      res.status(err.statusCode || 502).json(err.error || err);
    }
  });


  /**
   * Put a book into a bundle.
   */
  router.put('/bundle/:id/book/:pgid', async (req, res) => {
    try {
      const bundleUrl = `${url}/${req.params.id}`;

      const bookUrl =
          `http://${es.host}:${es.port}` +
          `/${es.books_index}/book/${req.params.pgid}`;


      // Request the bundle and book in parallel.
      const [bundleRes, bookRes] = await Promise.all([
        rp({url: bundleUrl, json: true}),
        rp({url: bookUrl, json: true}),
      ]);

      // Extract bundle and book information from responses.
      const {_source: bundle, _version: version} = bundleRes;
      const {_source: book} = bookRes;

      if (bundle.userKey !== getUserKey(req)) {
        throw {
          statusCode: 403,
          error: 'You are not authorized to modify this bundle.',
        };
      }

      const idx = bundle.books.findIndex(book => book.id === req.params.pgid);
      if (idx === -1) {
        bundle.books.push({
          id: req.params.pgid,
          title: book.title,
        });
      }

      // Put the updated bundle back in the index.
      const esResBody = await rp.put({
        url: bundleUrl,
        qs: { version },
        body: bundle,
        json: true,
      });
      res.status(200).json(esResBody);
    } catch (err) {
      res.status(err.statusCode || 502).json(err.error || err);
    }
  });


  /**
   * Remove a book from a bundle.
   */
  router.delete('/bundle/:id/book/:pgid', async (req, res) => {
    try {
      const bundleUrl = `${url}/${req.params.id}`;

      const {_source: bundle, _version: version} =
        await rp({url: bundleUrl, json: true});

      if (bundle.userKey !== getUserKey(req)) {
        throw {
          statusCode: 403,
          error: 'You are not authorized to modify this bundle.',
        };
      }

      const idx = bundle.books.findIndex(book => book.id === req.params.pgid);
      if (idx === -1) {
        throw {
          statusCode: 409,
          error: 'Conflict - Bundle does not contain that book.',
        };
      }

      bundle.books.splice(idx, 1);

      const esResBody = await rp.put({
        url: bundleUrl,
        qs: { version },
        body: bundle,
        json: true,
      });
      res.status(200).json(esResBody);
    } catch (err) {
      res.status(err.statusCode || 502).json(err.error || err);
    }
  });


  /**
   * Delete a bundle.
   */
  router.delete('/bundle/:id', async (req, res) => {
    try {
      const bundleUrl = `${url}/${req.params.id}`;

      const {_source: bundle, _version: version} =
        await rp({url: bundleUrl, json: true});

      if (bundle.userKey !== getUserKey(req)) {
        throw {
          statusCode: 403,
          error: 'You are not authorized to delete this bundle.',
        };
      }

      const esResBody = await rp.delete({
        url: bundleUrl,
        qs: { version },
        json: true,
      });
      res.status(200).json(esResBody);
    } catch (err) {
      res.status(err.statusCode || 502).json(err.error || err);
    }
  });

  return router;
};

