const path = require('path');
const express = require('express');

const app = express();

const TransFunctions = require('./app/services/muni');
const DisplayFunctions = require('./app/display');

let configModel = {};
let predicitonModel = {};
let weatherModel = {};
let i = 0;

const workflow = {
  doYourDoYourStuff() {
    i++;
    DisplayFunctions.showError(i);
    DisplayFunctions.stopTimers();
    DisplayFunctions.showError("show loading");
    DisplayFunctions.showLoading(configModel, weatherModel);
    DisplayFunctions.showError("loading config");
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
        DisplayFunctions.showError("stopping 2nd timer");
        DisplayFunctions.stopTimers();
        try {
          DisplayFunctions.showError("showing preds");
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
