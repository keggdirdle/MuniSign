const http = require('http');
const path = require('path');
const express = require('express');

const app = express();

const TransFunctions = require('./app/services/muni');
const DisplayFunctions = require('./app/display');

let configModel = {};
let predicitonModel = {};
let weatherModel = {};

const workflow = {
  doYourDoYourStuff() {
    DisplayFunctions.stopTimers();
    DisplayFunctions.showLoading(configModel, weatherModel);
    TransFunctions.loadConfig()
      .then(
        (resp) => {
          configModel = JSON.parse(resp);
          setTimeout(() => workflow.doYourDoYourStuff(), configModel.cache.data * 1000);
          return Promise.all([
            configModel,
            DisplayFunctions.getWeather(configModel, weatherModel),
            TransFunctions.getPredictions(configModel),
          ]);
        },
      )
      .then((resp) => {
        [, weatherModel, predicitonModel] = resp;
      })
      .then(() => {
        DisplayFunctions.stopTimers();
        try {
          DisplayFunctions.showPredictions(configModel, predicitonModel);
        } catch (e) {
          DisplayFunctions.showError(e);
        }
      });
  },
};

//workflow.doYourDoYourStuff();

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/index.html`));
});

app.listen(8080);

const onRequest = function (request, response) {
  if (request.url === '/favicon.ico') {
    response.writeHead(200, { 'Content-Type': 'image/x-icon' });
    response.end();
    return;
  }
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.write('Hello World');
  response.end();

  http.createServer(onRequest).listen(8001);
};
