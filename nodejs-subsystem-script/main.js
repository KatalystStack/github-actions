'use strict';

const { execSync } = require('child_process');
const { getInput } = require('../helpers/index');


async function run() {
	/**
	 * catalyst-stack/github-actions/nodejs-subsystem-setup@master
	 */
	await require('../nodejs-subsystem-setup/main');


	/**
	 * Run npm deps
	 */
	try {
		const npmScript = getInput('npm-script');
		execSync(`/bin/env npm run ${npmScript}`, { stdio: 'inherit' });
	} catch (error) {
		process.exit(1);
	}
}

module.exports = run();
