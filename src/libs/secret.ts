import fs from 'fs';

export function readSecret(secretName) {
  const path = process.env.SECRET_PATH || `/run/secrets/${secretName}`;
  try {
    return fs.readFileSync(path, 'utf8');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(
        `An error occurred while trying to read the secret path: ${path}. Err: ${err}`,
      );
    } else {
      console.debug(`Could not find the secret,: ${secretName}. Err: ${err}`);
    }
    return '';
  }
}
