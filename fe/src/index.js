'use strict';

const axios = require('axios');

const POLLING_INTERVAL_SECONDS = 60;

// promisifies the setTimeout function
const sleep = (time) => new Promise((resolve, reject) => {
  return setTimeout(resolve, time);
});

const updateElementText = (selector, data) => {
  document
    .querySelector(selector)
    .innerText = data
}

const hideElement = (selector) => {
  document
    .querySelector(selector)
    .style
    .display = 'none';
}

const showElement = (selector) => {
  document
    .querySelector(selector)
    .style
    .display = 'block';
}

const getCurrentPass = async () => {
  try {
    hideElement('.error');
    const {data} = await axios.get('http://localhost:8080/getData');
    if(!data) {
      updateElementText('.app-pass-checkins', '');
      updateElementText('.app-pass', 'no pass found')
      return;
    }

    updateElementText('.app-pass', `${data.passnamn} (${data.tid}-${data.sluttid})`);
    updateElementText('.app-pass-checkins', data.incheckade);
  } catch(e) {
    showElement('.error');

    updateElementText('.error', 'there was a problem');
    console.log('error', e);
  }
}

(async function() {
  while(true) {
    await getCurrentPass();
    await sleep(POLLING_INTERVAL_SECONDS * 1000);
  }
})();
