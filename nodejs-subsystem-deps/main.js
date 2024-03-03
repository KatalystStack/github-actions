'use strict';

const { execSync } = require('child_process');
const { getOutput } = require('../helpers/index');


async function run() {
	/**
	 * katalyststack/github-actions/nodejs-subsystem-setup@master
	 */
	await require('../nodejs-subsystem-setup/main');


	/**
	 * Run npm deps
	 */
	if (getOutput('cache-hit') !== 'true') {
		try {
			execSync(`/bin/env npm run deps`, { stdio: 'inherit' });
		} catch (error) {
			process.exit(1);
		}
	} else {
		console.log('Cache-hit, not building deps');
	}
}

module.exports = run();
