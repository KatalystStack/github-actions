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
		const stdOut = execSync(`/bin/env npm run ${npmScript}`);
		process.stdout.write(stdOut);
	} catch (error) {
		core.setFailed(error.message);
	}
}

module.exports = run();
