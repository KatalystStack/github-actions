'use strict';

const fs = require('fs');
const crypto = require('crypto');

const { internalSalt } = require('./config');
const { getInput, setInput, waitForStdOutPattern } = require('../helpers/index');


async function run() {
	/**
	 * actions/cache@v2
	 */
	const runnerOS = process.env.RUNNER_OS;
	const hashedFiles = crypto.createHash('sha256')
		.update(fs.readFileSync('./package-lock.json'))
		.digest("hex");
	const hashSalt = getInput('cache-salt');

	setInput('key', `${runnerOS}-deps-${internalSalt}${hashSalt}_${hashedFiles}`);
	setInput('path', getInput('cache-path'));
	require('../deps-cache/actions-cache/save/index');

	await waitForStdOutPattern(/(Cache hit occurred|Cache saved with key)/);

	console.log('actions/cache - complete!\n');


	/**
	 * actions/checkout@v2
	 */
	require('../deps-cache/actions-checkout/index');

	await waitForStdOutPattern(/git config --local --unset-all 'http..*.extraheader'/);

	console.log('actions/checkout - complete!\n');
}

module.exports = run();
