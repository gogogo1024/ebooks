// #!/usr/bin/env node --harmony
'use strict';
const

  log = require('npmlog'),
  request = require('request'),

  express = require('express'),
  passport = require('passport'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  app = express(),

  redisClient = require('redis').createClient(),
  RedisStore = require('connect-redis')(session),

  GoogleStrategy = require('passport-google').Strategy;

redisClient
  .on('ready', function() {
    log.info('REDIS', 'ready');
  })
  .on('error', function(err) {
    log.error('REDIS', err.message);
  });

passport.serializeUser(function(user, done) {
  done(null, user.identifier);
});
passport.deserializeUser(function(id, done) {
  done(null, {
    identifier: id
  });
});
passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000/'
  },
  function(identifier, profile, done) {
    profile.identifier = identifier;
    return done(null, profile);
  }
));

app.use(logger('short'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
  secret: 'unguessable',
  store: new RedisStore({
    client: redisClient
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/bower_components'));

const config = {
  bookdb: 'http://localhost:5984/books/',
  b4db: 'http://localhost:5984/b4/'
};
require('./lib/book-search.js')(config, app);
require('./lib/field-search.js')(config, app);
require('./lib/bundle.js')(config, app);

app.get('/auth/google/:return?',
  passport.authenticate('google', {
    successRedirect: '/'
  })
);
app.get('/auth/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

const authed = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else if (redisClient.ready) {
    res.json(403, {
      error: "forbidden",
      reason: "not_authenticated"
    });
  } else {
    res.json(503, {
      error: "service_unavailable",
      reason: "authentication_unavailable"
    });
  }
};

app.get('/api/user', authed, function(req, res) {
  res.json(req.user);
});

app.get('/api/user/bundles', authed, function(req, res) {
  let userURL = config.b4db + encodeURIComponent(req.user.identifier);
  request(userURL, function(err, couchRes, body) {
    if (err) {
      res.json(502, {
        error: "bad_gateway",
        reason: err.code
      });
    } else if (couchRes.statusCode === 200) {
      res.json(JSON.parse(body).bundles || {});
    } else {
      res.send(couchRes.statusCode, body);
    }
  });
});

app.put('/api/user/bundles', authed, function(req, res) {
  let userURL = config.b4db + encodeURIComponent(req.user.identifier);
  request(userURL, function(err, couchRes, body) {
    if (err) {
      res.json(502, {
        error: "bad_gateway",
        reason: err.code
      });
    } else if (couchRes.statusCode === 200) {
      let user = JSON.parse(body);
      user.bundles = req.body;
      request.put({
        url: userURL,
        json: user
      }).pipe(res);
    } else if (couchRes.statusCode === 404) {
      let user = {
        bundles: req.body
      };
      request.put({
        url: userURL,
        json: user
      }).pipe(res);
    } else {
      res.send(couchRes.statusCode, body);
    }
  });
});

app.listen(3000, function() {
  console.log("ready captain.");
});