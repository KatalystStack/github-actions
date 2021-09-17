'use strict';

const crypto = require('crypto');

const { getInput, setInput, waitForStdOutPattern } = require('../helpers/index');


async function run() {
	/**
	 * catalyst-stack/github-actions/input-or-ref-name@master
	 */
	const { inputOrRef } = await require('../input-or-ref-name/main');
	console.log('catalyst-stack/github-actions/input-or-ref-name - complete!\n');


	/**
	 * actions/setup-node@v2
	 */
	if (getInput('always-auth') === '') setInput('always-auth', 'false');
	if (getInput('check-latest') === '') setInput('check-latest', 'true');
	require('../deps-cache/actions-setup-node/index');

	await waitForStdOutPattern(/##\[add-matcher\]/);

	console.log('actions/setup-node - complete!\n');


	/**
	 * actions/checkout@v2
	 */
	setInput('ref', inputOrRef || '');
	if (getInput('repository') === '') setInput('repository', process.env.GITHUB_REPOSITORY);
	if (getInput('ssh-strict') === '') setInput('ssh-strict', 'true');
	if (getInput('persist-credentials') === '') setInput('persist-credentials', 'true');
	if (getInput('clean') === '') setInput('clean', 'true');
	if (getInput('fetch-depth') === '') setInput('fetch-depth', '1');
	if (getInput('lfs') === '') setInput('lfs', 'false');
	if (getInput('submodules') === '') setInput('submodules', 'false');
	require('../deps-cache/actions-checkout/index');

	await waitForStdOutPattern(/::remove-matcher/);

	console.log('actions/checkout - complete!\n');


	/**
	 * actions/cache@v2
	 */
	const runnerOS = process.env.RUNNER_OS;
	const hashedFiles = crypto.createHash('sha256')
		.update(fs.readFileSync('./package-lock.json'))
		.digest("hex");

	setInput('key', `${runnerOS}-deps-${hashedFiles}`);
	setInput('path', getInput('cache-path'));
	require('../deps-cache/actions-cache/restore/index');

	await waitForStdOutPattern(/(Cache not found for input keys|Cache restored from key)/);

	console.log('actions/cache - complete!\n');
}

module.exports = run();
