"use strict";

const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");
const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
const { fromCognitoIdentityPool } = require("@aws-sdk/credential-provider-cognito-identity");

const POLLING_INTERVAL_SECONDS = 600; // 10 minutes

// promisifies the setTimeout function
const sleep = (time) => new Promise((resolve, reject) => {
  return setTimeout(resolve, time);
});

const invokeLambda = async () => {
  const lambda = new LambdaClient({
    region: 'eu-west-1',
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: "eu-west-1" }),
      identityPoolId: "eu-west-1:17813a61-265e-4a95-a257-16957781bc81"
    }),
  });

  const command = new InvokeCommand({
    FunctionName : "hilti-checkins-parser",
    InvocationType : "RequestResponse",
  });

  try {
    const response = await lambda.send(command);

    return response;
  } catch (err) {
    console.log(err);
  }
}

const decodeLambdaResponse = (lambdaResponse) => {
  const dataView = new DataView(lambdaResponse.Payload.buffer);
  const decoder = new TextDecoder('utf-8');

  return JSON.parse(decoder.decode(dataView));
}

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
  console.log('fetching pass info');
  try {
    hideElement('.error');

    const data = decodeLambdaResponse(await invokeLambda());

    if(data.ongoing.toString() !== 'true') {
      updateElementText('.app-pass-checkins', '');
      updateElementText('.app-pass', 'no pass found')
      return;
    }

    updateElementText('.app-pass', `${data.name} (${data.start}-${data.end})`);
    updateElementText('.app-pass-checkins', data.checkins);
  } catch(e) {
    showElement('.error');

    updateElementText('.error', 'there was a problem');
    console.log('error', e);
  }
}

(async function() {
  updateElementText('.checking-again__countdown', POLLING_INTERVAL_SECONDS)
  while(true) {
    await getCurrentPass();
    let countdown = POLLING_INTERVAL_SECONDS;
    while(countdown > 0) {
      await sleep(1000);
      updateElementText('.checking-again__countdown', countdown)
      countdown -= 1;
    }
  }
})();
