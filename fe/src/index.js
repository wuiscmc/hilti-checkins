"use strict";

const axios = require("axios");

// promisifies the setTimeout function
const sleep = (time) => new Promise((resolve, reject) => {
  return setTimeout(resolve, time);
});

const updateElement = (selector, data) => {
	const element = document.querySelector(selector);
	element.innerText = data;
}

const getCurrentPass = async () => {
  try {
    console.log("fetching stuff...");
    const {data} = await axios.get("http://backend/getData");

    updateElement('.app-pass', `${data.passnamn} (${data.tid}-${data.sluttid})`);
    updateElement('.app-pass-checkins', data.incheckade);
  } catch(e) {
    updateElement('.error', "there was a problem");
    console.log("error", e);
  }
}

(async function() {
  while(true) {
    await getCurrentPass();
    await sleep(10000);
  }
})();
