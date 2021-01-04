'use strict';

const moment = require('moment');

const LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

const logLevel = () => {
  const level = process.env.LOG_LEVEL || 'warn';

  return isNaN(LEVELS[level])
  ? LEVELS.warn
  : LEVELS[level];
}

const now = () => {
	return moment().format('YY-MM-DD:HH:mm:ss:ms');
}

const output = (level, msg, time = now()) => {
  if(level < logLevel()) {
    return;
  }

	console.log(`[${time}][${level.toUpperCase()}] ${msg}`);
}

module.exports = {
	debug: (msg) => output('debug', msg),
	info: (msg) => output('info', msg),
	warn: (msg) => output('warn', msg),
	error: (msg) => output('error', msg),
}
