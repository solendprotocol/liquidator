import fs from 'fs'

export function readSecret(secretName) {
	try {
		const path = process.env.SECRET_PATH || `/run/secrets/${secretName}`
		return fs.readFileSync(path, 'utf8')
	} catch (err) {
		if (err.code !== 'ENOENT') {
			console.error(
				`An error occurred while trying to read the secret path: ${secretName}. Err: ${err}`
			)
		} else {
			console.debug(`Could not find the secret,: ${secretName}. Err: ${err}`)
		}
		return ''
	}
}
