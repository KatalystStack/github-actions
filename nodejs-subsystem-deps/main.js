'use strict';

const core = require('@actions/core');

const { execSync } = require('child_process');
const { getOutput } = require('../helpers/index');


async function run() {
	/**
	 * catalyst-stack/github-actions/nodejs-subsystem-setup@master
	 */
	await require('../nodejs-subsystem-setup/main');


	/**
	 * Run npm deps
	 */
	if (getOutput('cache-hit') !== 'true') {
		try {
			const stdOut = execSync(`/bin/env npm run deps`);
			process.stdout.write(stdOut);
		} catch (error) {
			core.setFailed(error.message);
		}
	} else {
		console.log('Cache-hit, not building deps');
	}
}

module.exports = run();
