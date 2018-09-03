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
          setTimeout(() => { 
            workflow.doYourDoYourStuff();
          }, configModel.cache.data * 1000);
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
          DisplayFunctions.stopTimers();
          DisplayFunctions.showError(e);
        }
      })
      .catch((err) => {
        DisplayFunctions.showError(err);
      });
  },
};

workflow.doYourDoYourStuff();

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/index.html`));
});

app.listen(8080);
