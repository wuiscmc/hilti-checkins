"use strict";

const moment = require("moment");

const now = () => {
	return moment().format('YY-mm-DD:HH:MM:ss:ms');
}

const output = (level, msg, time = now()) => {
	console.log(`[${time}][${level.toUpperCase()}] ${msg}`)
}

module.exports = {
	debug: (msg) => output("debug", msg),
	info: (msg) => output("info", msg),
	warn: (msg) => output("warn", msg),
	error: (msg) => output("error", msg),
}
