'use strict';

const axios = require('axios');
const {parse, validate} = require('fast-xml-parser');
const moment = require('moment');
const logger = require('./logger');

const FEED_URL = 'https://www.gymcontrol.se/user/8935/xml/xml_gym_pass.php';

const fetchDailyPasses = async () => {
	logger.debug('Fetching data from gymcontrol');

	const {data} = await axios.get(FEED_URL, {
		responseType: 'document',
		headers: {
			'Content-Type': 'text/xml',
			'Origin': 'http://localhost'
		},
	});

	return data;
}

const passtimeToDateTime = (rawDate) => {
	const [hour, minute] = rawDate.split(':');
	const date = moment();
	date.hour(hour);
	date.minute(minute);

	return date;
}

const getAllPasses = async () => {
	try {
    const rawData = await fetchDailyPasses();
    if(validate(rawData) !== true){ // fast-xml-parser returns an object when the data is not XML
      logger.warn(`API returned a non XML object: ${rawData}`);
      return;
    }

		const {table: {row}} = parse(rawData);
		return row;
	} catch (e) {
		logger.error('There was an issue fetching the daily passes');
		logger.error(e);
	}
}


const getPassInfo = async (time = moment()) => {
	const passes = (await getAllPasses()) || [];
	if(passes.length === 0) {
		logger.warn('No passes found');
		return;
	}

	return passes.pop(); // delete after tests
	passes.find((pass) => {
		const begin = passtimeToDateTime(pass.tid);
		const end = passtimeToDateTime(pass.sluttid);

		return time >= begin && time < end;
	});
}

module.exports = getPassInfo
