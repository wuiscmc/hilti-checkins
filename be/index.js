"use strict";

const http = require('http');
const getPassInfo = require('./getPassInfo');
const logger = require('./logger');
const PORT = process.env.PORT || 1337;

http.createServer((req, res) => {
	if(req.url !== "/getData") {
		logger.info(`${req.url} not found`);
		res.statusCode = 404;
		res.end();
		return;
	}

	logger.info(`Fetching current pass info`);
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json');

	getPassInfo()
		.then((data) => {
			if(!data) {
				res.end();
				return;
			}
			res.end(JSON.stringify(data || {}));
		})
		.catch((error) => {
			res.statusCode = 500;
			logger.error(error);
			res.end();
		});

}).listen(PORT, () => {
	logger.info(`Server started on port ${PORT}`)
});
