let chalk = require('chalk');

function hash(length) {
	let text = "";
	let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < length; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function parseJson(str) {
	try {
		return JSON.parse(str);
	} catch (e) {
		return str;
	}
}

function log (method, file, ...data) {
	console.log(`
${chalk`///////////////////////////`}
${chalk`{bold ${method}}`}
	`);
	data.forEach(elm => {
		console.log(elm);
	});
	console.log(`
${chalk`{rgb(255, 235, 58).underline ${file}}`}
${chalk`///////////////////////////`}
	`);
}

function error (method, file, ...data) {
	console.log(`
${chalk`{red ///////////////////////////}`}
${chalk`{bold.red ${method}}`}
	`);
	data.forEach(elm => {
		console.log(elm);
	});
	console.log(`
${chalk`{red.underline ${file}}`}
${chalk`{red ///////////////////////////}`}
	`);
}

module.exports = {parseJson, hash, log, error};
