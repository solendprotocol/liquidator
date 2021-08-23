import fs from 'fs';

export function readSecret(secretName) {
  try {
    return fs.readFileSync(`/run/secrets/${secretName}`, 'utf8');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`An error occurred while trying to read the secret: ${secretName}. Err: ${err}`);
    } else {
      console.debug(`Could not find the secret,: ${secretName}. Err: ${err}`);
    }
    return '';
  }
}
