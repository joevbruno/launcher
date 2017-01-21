/* @flow */
/* eslint-disable no-console */
import 'source-map-support/register';

import path from 'path';
import express from 'express';
import compression from 'compression';
import expressSanitizer from 'express-sanitizer';
import morgan from 'morgan';
import favicon from 'serve-favicon';
import expressJwt from 'express-jwt';
import timeout from 'connect-timeout';
import boom from 'express-boom';
import helmet from 'helmet';
import uuid from 'uuid';
import hpp from 'hpp';
import cors from 'cors';
import { expressMiddleware } from 'electrode-csrf-jwt';

import multer from 'multer';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import appRootDir from 'app-root-dir';

import passport from 'passport';

import routes from '../common/routes/routes';
import offlinePage from './middleware/offlinePage';
import { errorHandlersMiddleware } from './middleware/errorHandlers';
import { reactApplication } from './middleware/reactApplication';
import { clientBundle } from './middleware/clientBundle';

import api from './modules';
import db from './config/db';

db.connect();

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';
global.document = global.document || {};
global.fetch = fetch || require('isomorphic-fetch');


// Create our express based server.
const app = express();
const upload = multer({ dest: 'uploads/' });
const isDebug = process.env.NODE_ENV === 'development';
const publicPath = path.resolve(appRootDir.get(), 'public');
const port = process.env.PORT || 3000;

// favicon
app.use(favicon(path.join(publicPath, 'favicon.ico')));

// Gzip compress the responses.
app.use(compression());

// log
app.use(morgan('combined'));

// static
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// security
const cspConfig = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", 'cdn.polyfill.io', (req, res) => `'nonce-${res.locals.nonce}'`],
  styleSrc: ["'self'", "'unsafe-inline'", 'blob:'],
  imgSrc: ["'self'"],
  connectSrc: ['*'], // ["'self'", 'ws:'],
  fontSrc: ["'self'", 'data:'],
  objectSrc: ["'self'"],
  mediaSrc: ["'self'"],
  childSrc: ["'self'"]
};

const csrf = {
  secret: 'shhhhh',
  expiresIn: 60
};

if (isDebug) {
  Object.keys(cspConfig.directives).forEach((directive) => {
    cspConfig.directives[directive].push(
      'localhost:5000',
    );
  });
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

app.use(expressSanitizer());
app.use(boom());
app.use(timeout('60s'));
app.use(cors());
app.use(expressMiddleware(csrf));

app.use((req, res, next) => {
  res.locals.nonce = uuid.v4(); // eslint-disable-line no-param-reassign
  next();
});
app.use(hpp());
app.disable('x-powered-by');
app.use(helmet.xssFilter());
app.use(helmet.frameguard('deny'));
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.contentSecurityPolicy(cspConfig));

// Auth
app.use(expressJwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token,
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// API
app.use('/api/v1', api);

if (!isDebug) {
  app.get('/sw.js', (req, res) => res.sendFile(
    path.resolve(
      appRootDir.get(),
      'client/sw.js'
    ),
  ));
  app.get('client/offline.html', offlinePage);
}

// Configure serving of our client bundle.
app.use('client', clientBundle);
app.use(express.static(publicPath));

// The React application middleware.
Object.values(routes).forEach(route => app.get(route, reactApplication));

// Error Handler middlewares.
app.use(...errorHandlersMiddleware);

// Create an http listener for our express app.
const listener = app.listen(port, 'localhost', () => console.log(`Server listening on port ${port}`));

export default listener;
