process.env.UV_THREADPOOL_SIZE = 128;

const log4js = require('log4js');
const config = require('./config.js');
const Display = require('./app/display');
const TransService = require('./app/services/muni');
const WeatherService = require('./app/services/weather');
const LyftService = require('./app/services/lyft');
const UberService = require('./app/services/uber');
const now = new Date();

log4js.configure({
  appenders: { muni: { type: 'file', filename: `./logs/server.log` } },
  categories: { default: { appenders: ['muni'], level: 'debug' } }
});
const logger = log4js.getLogger();

let timer;
let configModel = config.configModel;
let predictionModel = {};
let weatherModel = {};
let lyftModel = {};
let uberModel = {};
const timers = [];
let isError = false;

const showDateTime = async (runTime, runNext = true) => {
  await Display.showDateTime(configModel);
  if (runNext) {
    timer = setTimeout(() => {
      next();
    }, runTime);
    timers.push(timer);
  }
};

const showWeather = async (runTime, runNext = true) => {
  try {
    weatherModel = await WeatherService.getForcast(configModel);
    await Display.showWeather(configModel, weatherModel);
    if (runNext) {
      timer = setTimeout(() => {
        next();
      }, runTime);
      timers.push(timer);
    }
  } catch (err) {
    logger.error(`showWeather threw ${err.message} moving on...`);
    if (err.message === "Error: ETIMEDOUT" || err.message === "Error: ESOCKETTIMEDOUT") {
      next();
    } else {
      next();
    }
  }
};

const muniPredictions = async (runTime, runNext = true) => {
  try {
    predictionModel = await TransService.getPredictions(configModel);
    await Display.showPredictions(configModel, predictionModel);
    if (runNext) {
      timer = setTimeout(() => {
        next();
      }, runTime);
      timers.push(timer);
    }
  } catch (err) {
    logger.error(err.stack)
    logger.error(`muniPredictions threw ${err.message} killing the process...`);
    if (err.message === "Error: ETIMEDOUT" || err.message === "Error: ESOCKETTIMEDOUT") {
      process.exit(1);
    } else {
      next();
    }
  }
}

const lyftEstimate = async (runTime, runNext = true) => {
  try {
    lyftModel = await LyftService.getCostEstimate(configModel);
    await Display.showShareCarEstimate(lyftModel, null);
    if (runNext) {
      timer = setTimeout(() => {
        next();
      }, runTime);
      timers.push(timer);
    } 
  } catch (err) {
    logger.error(`lyftEstimate threw ${err.message} moving on...`);
    if (err.message === "Error: ETIMEDOUT" || err.message === "Error: ESOCKETTIMEDOUT") {
      next();
    } else {
      next();
    }
  }
}

const uberEstimate = async (runTime, runNext = true) => {
  try {
    uberModel = await UberService.getCostEstimate(configModel);
    await Display.showShareCarEstimate(null, uberModel);
    if (runNext) {
      timer = setTimeout(() => {
        next();
      }, runTime);
      timers.push(timer);
    } 
  } catch (err) {
    logger.error(`uberEstimate threw ${err.message} moving on...`);
    if (err.message === "Error: ETIMEDOUT" || err.message === "Error: ESOCKETTIMEDOUT") {
      next();
    } else {
      next();
    }
  }
}

const workFlow = [
  {

    functionName: showDateTime,
    runTime: 2500,
    order: 0
  }
  ,
  {
      functionName: showWeather,
      runTime: 2500,
      order: 1
  }
  ,
  {
      functionName: muniPredictions,
      runTime: 100000,
      order: 2
  }
  //,
  // {
  //     functionName: lyftEstimate,
  //     runTime: 2500,
  //     order: 3
  // }
  // ,
  // {
  //     functionName: uberEstimate,
  //     runTime: 2500,
  //     order: 4
  // }
]

let i = 0;
const next = (timer) => {
  try {
    if (isError) {
      logger.error(error)
        stop();
        return;
    }
    stop();
    Display.stopTimers();
    const {
        functionName,
        runTime
    } = workFlow.find(a => a.order === i);
    try {
      functionName(runTime);
    } catch (err) {
      logger.error(`${functionName} threw ${err.message} moving on...`);
      if (err.message === "Error: ETIMEDOUT" || err.message === "Error: ESOCKETTIMEDOUT") {
        
      } else {
        next();
      }
    }
    i++;
    i === workFlow.length ? i = 0 : i = i;
  } catch(error) {
    isError = true;
    logger.error(error.message);
    logger.error(error.stack);
    process.kill();
  }
}

const stop = () => {
  timers.forEach((timer) => {
      clearTimeout(timer);
  })
}
logger.debug("Starting Up!");
Display.showInit();
setTimeout(() => {
  next();
}, 1000 * 5);

var express = require('express');
const app = express();
const port = 8088;
var path = require('path');
const defaultDirectory = path.join(__dirname + '/../web/');

app.get('/', (req, res) => {
  res.sendFile(defaultDirectory + "index.html");
})

app.get('/exit', (req, res) => {
  logger.debug("Exiting Process via web");
  process.exit();
})

app.get('/reboot', (req, res) => {
  _reboot();
})

app.get('/start', (req, res) => {
  next();
})

app.get('/callmuni', (req, res) => {
  muniPredictions(null, false);
})
