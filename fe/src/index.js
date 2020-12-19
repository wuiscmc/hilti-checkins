"use strict"; 

const axios = require("axios");

const getCurrentPass = async () => {
	const {data} = await axios.get("http://localhost:8080/getData");
	return data;
}

const updateElement = (selector, data) => {
	const element = document.querySelector(selector);
	element.innerHTML = data; 
}

getCurrentPass()
	.then((data) => {
		updateElement('.app-pass', `${data.passnamn} (${data.tid}-${data.sluttid})`);
		updateElement('.app-pass-checkins', data.incheckade);
	})
	.catch((error) => {
		console.log(error);
	});
