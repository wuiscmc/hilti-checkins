'use strict';

const axios = require('axios');
const {parse, validate} = require('fast-xml-parser');
const moment = require('moment');
const logger = require('./logger');

const FEED_URL = 'https://www.gymcontrol.se/user/8935/xml/xml_gym_pass.php';

const requestDailyPasses = async () => {
  logger.debug('Fetching data from gymcontrol');

  const {data} = await axios.get(FEED_URL, {
    responseType: 'document',
    headers: {
      'Content-Type': 'text/xml',
      'Origin': 'http://localhost'
    },
  });
  // return `<table><row><passnamn>pass</passnamn><tid>00:00</tid><sluttid>23:00</sluttid><incheckade>10</incheckade></row></table>`;

  return data;
}

const passtimeToDateTime = (rawDate) => {
  const [hour, minute] = rawDate.split(':');
  const date = moment();
  date.hour(hour);
  date.minute(minute);

  return date;
}

const fetchTodaysPasses = async () => {
  try {
    const rawData = await requestDailyPasses();

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

const findCurrentPass = async (time = moment()) => {
  const passes = Array(await fetchTodaysPasses()).flat().filter(Boolean);

  if(passes.length === 0) {
    logger.warn('No passes found');
    return;
  }

  return passes.find((pass) => {
    const begin = passtimeToDateTime(pass.tid);
    const end = passtimeToDateTime(pass.sluttid);

    return time >= begin && time < end;
  });
}

exports.handler =  async (event, context) => {
  const pass = await findCurrentPass();
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
