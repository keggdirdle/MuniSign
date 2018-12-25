const log4js = require('log4js');
const config = require('./config.js');
const Display = require('./app/display');
const TransService = require('./app/services/muni');
const WeatherService = require('./app/services/weather');
const LyftService = require('./app/services/lyft');
const UberService = require('./app/services/uber');

//const Axios = require('axios');
//const https = require('https');
//const request = require('request');

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

const showTimeandWeather = async (runTime, runNext = true) => {
  weatherModel = await WeatherService.getForcast(configModel);
  await Display.showLoading(configModel, weatherModel);
  if (runNext) {
    timer = setTimeout(() => {
      next();
    }, runTime);
    timers.push(timer);
  }
};

const muniPredictions = async (runTime, runNext = true) => {
  predictionModel = await TransService.getPredictions(configModel);
  await Display.showPredictions(configModel, predictionModel);
  if (runNext) {
    timer = setTimeout(() => {
      next();
    }, runTime);
    timers.push(timer);
  }
}

const lyftEstimate = async (runTime, runNext = true) => {
  lyftModel = await LyftService.getCostEstimate(configModel);
  await Display.showShareCarEstimate(lyftModel, null);
  if (runNext) {
    timer = setTimeout(() => {
      next();
    }, runTime);
    timers.push(timer);
  }
}

const uberEstimate = async (runTime, runNext = true) => {
  uberModel = await UberService.getCostEstimate(configModel);
  await Display.showShareCarEstimate(null, uberModel);
  if (runNext) {
    timer = setTimeout(() => {
      next();
    }, runTime);
    timers.push(timer);
  }
}

const workFlow = [
  {
      functionName: showTimeandWeather,
      runTime: 5000,
      order: 0
  }
  ,
  {
      functionName: muniPredictions,
      runTime: 45000,
      order: 1
  }
  ,
  {
      functionName: lyftEstimate,
      runTime: 5000,
      order: 2
  }
  ,
  {
      functionName: uberEstimate,
      runTime: 5000,
      order: 3
  }
]

let isError = false;
let i = 0;
const next = (timer) => {
  console.log(3);
  try {
    if (isError) {
      console.log(error)
        stop();
        return;
    }
    stop();
    Display.stopTimers();
    //Display.kill();
    const {
        functionName,
        runTime
    } = workFlow.find(a => a.order === i);
    //Display.clear(configModel);
    functionName(runTime);
    i++;
    i === workFlow.length ? i = 0 : i = i;
  } catch(error) {
    isError = true;
    logger.error(error.message);
    logger.error(error.stack);
    console.log(error.message);
    console.log(error.stack);
    process.end();
    //logger.error("rebooting pi...");
    //_reboot();
  }
}

const stop = () => {
  timers.forEach((timer) => {
      clearTimeout(timer);
  })
  //console.log("Timers Cleared");
}
logger.debug("Starting Up!");
console.log(1);
Display.showInit();
console.log(2);
setTimeout(() => {
  next();
}, 2000);

// var maxRequest = request.defaults({
//   pool: {
//     keepAlive: true,
//     maxSockets: Infinity
//   }
// })

// const debug = () => {
//   let i = 0;
//   setInterval(() => {
//     i++;
//     try {
//       maxRequest.get(
//         { 
//           url: `https://jsonplaceholder.typicode.com/todos/${i}`, 
//           forever: true, 
//           agent: false,
//           timeout: 5000
//         }, function(error, response, body) { 
//       if (!error && response.statusCode == 200) {  
//         var res = JSON.parse(response.body);
//         Display.show(configModel, res.id);     
//         } else {
//               logger.error(`get error`);
//               logger.error(response.statusCode);
//               logger.error(error.message);
//               logger.error(error.stack);
//               process.exit();
//               res.end();
//       }
//       }).on('end', function() {
//           return;
//       }).on('error', function(error){
//           logger.debug(`2`);
//           logger.error(error);
//       }).end();
//     } catch (e) {
//       logger.error(`catch error`);
//       logger.error(e);
//       logger.error(e.message);
//       logger.error(e.stack);
//     }
//   }, 500)
// }

//debug();

//Display.show(configModel, "OB #MOceanview switching back at #SFSU. Shuttles to support. IB M unaffected. https://t.co/lE4lhQhCny");

//web server and routes

// const _reboot = () => {
//   const script = 'sudo reboot';
//   const { exec } = require('child_process');
//   let child = exec(script, (error, stdout, stderr) => {});
// }

var express = require('express');
const app = express();
const port = 8088;
var path = require('path');
const defaultDirectory = path.join(__dirname + '/../web/');

// app.get('/', (req, res) => {
//   res.sendFile(defaultDirectory + "index.html");
// })

// // Serve static files from the main build directory
// app.use(express.static(__dirname + '/build/bundled'));

// app.get('/addstop', (req, res) => {
//   res.sendFile(defaultDirectory + "addstop.html");
// })

// app.get('/exit', (req, res) => {
//   logger.debug("Exiting Process");
//   process.exit();
// })

// app.get('/node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js', (req, res) => {
//   res.sendFile(defaultDirectory + "/node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js");
// })


// app.get('/config', (req, res) => {
//   res.sendFile(defaultDirectory + "/config.json");
// })


// app.use('/showlog', (req, res) => {
//   console.log(`trying to get ${__dirname + "/logs/server.log"}`)
//   try {
//     res.sendFile(__dirname + "/logs/server.log");
//   } catch (err) {
//     console.log(err.stack);
//   }
// })

// app.get('/reboot', (req, res) => {
//   _reboot();
// })

// app.get('/start', (req, res) => {
//   next();
// })

// app.get('/renameLogFile', (req, res) => {
//   const script = 'mv logs/server.log logs/server-old.log';
//   const { exec } = require('child_process');
//   let child = exec(script, (error, stdout, stderr) => {});
// })

// app.get('/calllyft', (req, res) => {
//   lyftEstimate(null, false);
// })

// app.get('/calluber', (req, res) => {
//   uberEstimate(null, false);
// })

// app.get('/callweather', (req, res) => {
//   showTimeandWeather(null, false);
// })

// app.get('/callmuni', (req, res) => {
//   muniPredictions(null, false);
// })

//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
