'use strict';

const axios = require('axios');
const {parse, validate} = require('fast-xml-parser');

const moment = require('moment-timezone');

const logger = require('./logger');

const FEED_URL = 'https://www.gymcontrol.se/user/8935/xml/xml_gym_pass.php';

const now = () => {
  return moment().tz('Europe/Stockholm');
}

const fetchGymcontrolPasses = async () => {
  const {data} = await axios.get(FEED_URL, {
    responseType: 'document',
    headers: {
      'Content-Type': 'text/xml',
    },
  });

  return data;
}

const parseXMLPasses = (rawData) => {
  try {
    if(validate(rawData) !== true){ // fast-xml-parser returns an object when the data is not XML
      logger.warn(`API returned a non XML object: ${rawData}`);
      return [];
    }

    const {table: {row}} = parse(rawData);
    const passes = Array(row).flat().filter(Boolean);

    return passes;
  } catch (e) {
    logger.error('There was an issue fetching the daily passes');
    logger.error(e);
  }
}

const passtimeToDateTime = (rawDate) => {
  const [hour, minute] = rawDate.split(':');
  const date = now();
  date.hour(hour);
  date.minute(minute);

  return date;
}

const findCurrentPass = (passes) => {
  if(passes.length === 0) {
    return;
  }

  const time = now();

  return passes.find((pass) => {
    const begin = passtimeToDateTime(pass.tid);
    const end = passtimeToDateTime(pass.sluttid);

    return time >= begin && time < end;
  });
}

exports.handler =  async (event, context) => {
  logger.info('Fetching passes from gymcontrol');
  const xmlPasses = await fetchGymcontrolPasses();

  logger.info('Parsing retrieved info');
  const passes = parseXMLPasses(xmlPasses);
  logger.info(`Parsed ${passes.length} passes`);

  const pass = findCurrentPass(passes);

  if(!pass) {
    return {
      ongoing: false
    };
  }

  return {
    ongoing: true,
    name: pass.passnamn,
    start: pass.tid,
    end: pass.sluttid,
    checkins: pass.incheckade,
    instructor: pass.instruktor,
  }
}
