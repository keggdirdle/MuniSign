var express = require('express');
const app = express();
const port = 8088;

let timer;

const Cache = require('./app/cache');

const log4js = require('log4js');
const now = new Date();
log4js.configure({
  appenders: { muni: { type: 'file', filename: `./logs/server.log` } },
  categories: { default: { appenders: ['muni'], level: 'debug' } }
});
const logger = log4js.getLogger();

const Display = require('./app/display');
const TransFunctions = require('./app/services/muni');
let configModel = {};

const showLoading = (configModel) => {
  Display.stopTimers();
  Display.showLoading(configModel);
  setTimeout(() => {
    requestLoop()
  }, configModel.cache.display * 1000);
}

var requestLoop = () => {
      TransFunctions.loadConfig()
      .then((resp) => {
          configModel = JSON.parse(resp);
          //logger.info(`config loaded for the ${i}th time...`);
      })
      // .then(() => {
      //   logger.info(`loading weather? for the ${i}th time...`);
      //   //Cache.get(`weather`,`http://api.openweathermap.org/data/2.5/forecast?zip=94103,us&units=imperial&appid=612f4aa40986989c6b698bc2bf4a1b01`)
      //   Cache.get(`test`, `http://webservices.nextbus.com/service/publicJSONFeed?command=predictionsForMultiStops&a=sf-muni&stops=47|5545&stops=F|5652&stops=76X|6833&stops=90|5545&stops=14|5544&stops=N|5419`)
      //   .then((response) => {
      //     //weatherModel = JSON.parse(response);
      //   })
      // })
      .then(() => {
        TransFunctions.getPredictions(configModel)
        .then((response) => {
          Display.stopTimers();
          Display.showPredictions(configModel, response);  
          const dataRefresh = configModel.cache.data;
          timer = setTimeout(() => {
            showLoading(configModel);
            //requestLoop();
          }, dataRefresh * 1000);
        })
        .catch((error) => {
          logger.error(error.message);
          logger.error(error.stack);
          if (error.message === "ETIMEDOUT") {
            Display.show("stopping");
            Display.show("check logs");
            clearTimeout(timer);
          } else {
            process.exit();
          }
        })
      })
      .catch((err)=> {
        logger.error(error.message);
        logger.error(error.stack);
        Display.show("err: " + err.message);
      })
  };

Display.showInit();
requestLoop();

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

app.get('/exit', (req, res) => {
  process.exit();
})

app.use('/showlog', (req, res) => {
  console.log(`trying to get ${__dirname + "/logs/server.log"}`)
  try {
    res.sendFile(__dirname + "/logs/server.log");
  } catch (err) {
    console.log(err.stack);
  }
})

app.get('/reboot', (req, res) => {
  const script = 'sudo reboot';
  const { exec } = require('child_process');
  let child = exec(script, (error, stdout, stderr) => {});
})

app.get('/start', (req, res) => {
  const script = 'node server';
  const { exec } = require('child_process');
  let child = exec(script, (error, stdout, stderr) => {});
})

app.get('/purge', (req, res) => {
  const script = 'mv logs/cache.log logs/cache-old.js';
  const { exec } = require('child_process');
  let child = exec(script, (error, stdout, stderr) => {});
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
