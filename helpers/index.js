'use strict';

const Stream = require('stream');


function hook_stdout(callback) {
    var old_write = process.stdout.write

    process.stdout.write = (function(write) {
        return function(string, encoding, fd) {
            write.apply(process.stdout, arguments)
            callback(string, encoding, fd)
        }
    })(process.stdout.write)

    return function() {
        process.stdout.write = old_write
    }
}



// Converts the given input name to an environment variable name
function getInputEnvName(name) {
	return `INPUT_${name.replace(/ /g, '_').toUpperCase()}`;
}
exports.getInputEnvName = getInputEnvName;


// Gets the given input from environment
function getInput(name, options) {
	const envName = getInputEnvName(name);
	const val = process.env[envName] || '';
	if (options && options.required && !val) {
		throw new Error(`Input required and not supplied: ${name}`)
	}

	return val.trim()
}
exports.getInput = getInput;


// Sets the given input to the environment
function setInput(name, val) {
	const envName = getInputEnvName(name);
	process.env[envName] = (val || '').trim();
}
exports.setInput = setInput;



// Converts the given input name to an environment variable name
function getOutputEnvName(name) {
	return `OUTPUT_${name.replace(/ /g, '_').toUpperCase()}`;
}
exports.getOutputEnvName = getOutputEnvName;


// Gets the given input from environment
function getOutput(name, options) {
	const envName = getOutputEnvName(name);
	const val = process.env[envName] || '';
	if (options && options.required && !val) {
		throw new Error(`Output required and not supplied: ${name}`)
	}

	return val.trim()
}
exports.getOutput = getOutput;


// Sets the given input to the environment
function setOutput(name, val) {
	const envName = getOutputEnvName(name);
	process.env[envName] = (val || '').trim();
}
exports.setOutput = setOutput;



// Duplexes stdout to a local stream
const stdoutStream = new Stream.Readable();
stdoutStream._read = function () {};
stdoutStream.pause();
hook_stdout(function(string) {
	stdoutStream.push(string);
});
exports.stdoutStream = stdoutStream;


// Waits for an stdout line which is of a sepcific regex pattern
async function waitForStdOutPattern(pattern) {
	await new Promise((resolve) => {
		let line = '';
		const listener = function (data) {
			const lines = data.toString().split('\n');

			while (lines.length > 1) {
				line += lines.shift();

				const output = line.match(/::set-output name=([^:]+)::(.*)/);
				if (output) {
					setOutput(output[1], output[2]);
				}

				if (line.match(pattern)) {
					stdoutStream.pause();
					stdoutStream.unshift(lines.join('\n'));
					stdoutStream.removeListener('data', listener);

					return resolve();
				}

				line = '';
			}
			line += lines.shift();
		}
		stdoutStream.addListener('data', listener);
		stdoutStream.resume();
	});
}
exports.waitForStdOutPattern = waitForStdOutPattern;
