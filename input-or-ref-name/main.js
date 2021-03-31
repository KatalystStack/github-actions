'use strict';

const path = require('path');

const { execSync } = require('child_process');
const { getInput } = require('../helpers/index');


async function run() {
	const scriptPath = path.resolve(__dirname, './main.sh');

	process.env.TARGET_REF = getInput('target-ref');
	const stdOut = execSync(`/bin/bash ${scriptPath}`);
	process.stdout.write(stdOut);

	const inputOrRef = stdOut.toString()
		.split('\n')
		.filter((s) => s.indexOf('name=ref::') >= 0)[0]
		.split('::')[2];

	return { inputOrRef }
}

module.exports = run();
