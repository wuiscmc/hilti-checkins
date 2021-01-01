"use strict"; 

const axios = require("axios");
const {promisify} = require("util");
const sleep = promisify(setTimeout);
const BACKEND_URL = process.env.BACKEND_URL || "http://backend/getData";

const updateElement = (selector, data) => {
	const element = document.querySelector(selector);
	element.innerHTML = data; 
}

const getCurrentPass = async () => {
	const {data} = await axios.get(BACKEND_URL);
  updateElement('.app-pass', `${data.passnamn} (${data.tid}-${data.sluttid})`);
  updateElement('.app-pass-checkins', data.incheckade);
}

function* generator() {
  while(true) {
    yield true;
  }
}

(async function() {
  for await(let i of generator()) {
    await getCurrentPass();
  }
})();
