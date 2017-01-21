import path from 'path';
import fs from 'fs';

const appDirectory = fs.realpathSync(process.cwd());

export function ensureSlash(rpath, needsSlash) {
  const hasSlash = rpath.endsWith('/');

  if (hasSlash && !needsSlash) {
    return rpath.substr(rpath, rpath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${rpath}/`;
  }

  return rpath;
}

export function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}
