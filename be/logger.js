'use strict';

const LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

const logLevel = () => {
  const level = process.env.LOG_LEVEL && !isNaN(LEVELS[process.env.LOG_LEVEL])
  ? process.env.LOG_LEVEL
  : 'info';

  return LEVELS[level];
};

const output = (level, msg) => {
  if(LEVELS[level] < logLevel()) {
    return;
  }

	console.log(`[${level.toUpperCase()}] ${msg}`);
}

module.exports = {
	debug: (msg) => output('debug', msg),
	info: (msg) => output('info', msg),
	warn: (msg) => output('warn', msg),
	error: (msg) => output('error', msg),
}
