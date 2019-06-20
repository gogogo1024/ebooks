/***
 * Excerpted from "Node.js 8 the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode2 for more book information.
***/
'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const path = `${__dirname}/views`;

router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

router.get('/', (req, res) => res.sendFile(`${path}/index.html`));

app.use('/', router);

app.listen(3000);
