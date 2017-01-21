import crypto from 'crypto';
import utils from 'keystone-utils';

const LENGTH = 64;

export function tokenize(salt, secret) {
  return salt + crypto.createHash('sha1').update(salt + secret).digest('hex');
}

export function createSecret() {
  return crypto.pseudoRandomBytes(LENGTH).toString('base64');
}

export function createToken(req) {
  return tokenize(utils.randomString(LENGTH), exports.getSecret(req));
}
