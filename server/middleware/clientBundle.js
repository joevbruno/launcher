/* @flow */

import express from 'express';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';

// Middleware to server our client bundle.
const filePath = pathResolve(appRootDir.get(), 'build/client');
export const clientBundle = express.static(
  filePath,
  { maxAge: '365d' },
);
