const sign = require('./sign.js');
const weatherService = require('./services/weather');
const fs = require('fs');
const ip = require('ip');

// const log4js = require('log4js');
// const now = new Date();
// log4js.configure({
//   appenders: { muni: { type: 'file', filename: `server-${now.getMilliseconds()}.log` } },
//   categories: { default: { appenders: ['muni'], level: 'debug' } }
// });
// const logger = log4js.getLogger();

let displayHandle;

/**
 * Displays the schedule for the selected routes and stops
 * @param configModel This is the JSON from the static config file
 * @param predictionModel This is the JSON response from the API call
 */
const showPredictions = function (configModel, predictionModel, index = 0) {
  return new Promise((resolve, reject) => {  
      try { 
        //showError("in show Preds");
        const i = 0;
        let output = '';
        let output2 = '';
        if (_hasPredictions(predictionModel, index)) {
          
            //logger.info(`building output for the ${index}th time`);
            const currentPrediction = predictionModel[index];
            const currentDirection = _getDirection(configModel, currentPrediction.stopTag)
            output += `${currentPrediction.routeTitle} ${currentDirection}`;
            if (currentPrediction.direction[0]) {
              if (currentPrediction.direction[0].prediction[0]) {
                output2 += `${_isArriving(currentPrediction.direction[0].prediction[0].minutes)}`;
              } else if (currentPrediction.direction[0].prediction) {
                output2 += `${_isArriving(currentPrediction.direction[0].prediction.minutes)}`;
              }

              if (currentPrediction.direction[0].prediction[1]) {
                output2 += ` & ${currentPrediction.direction[0].prediction[1].minutes} min`;
              }
            } else {

              if (currentPrediction.direction.prediction[0]) {
                output2 += `${_isArriving(currentPrediction.direction.prediction[0].minutes)}`;
              } else if (currentPrediction.direction.prediction) {
                output2 += `${_isArriving(currentPrediction.direction.prediction.minutes)}`;
              }

              if (currentPrediction.direction.prediction[1]) {
                output2 += ` & ${currentPrediction.direction.prediction[1].minutes} min`;
              }
            }
        }
        if (output !== '') {
          displayHandle = setTimeout(() => {
            clear(configModel);
            show(configModel, output);
            show(configModel, output2);
            index === predictionModel.length - 1 ? index = 0 : index++;
            //we're at the end of the loop, go back to the beginning
          showPredictions(configModel, predictionModel, index);
          }, configModel.cache.display * 1000);
        } else {
          displayHandle = setTimeout(() => {
            index === predictionModel.length - 1 ? index = 0 : index++;
            //no predictions for that route, get the next one
          showPredictions(configModel, predictionModel, index);
          }, 10);
        }
        return resolve();
      } catch (error) {
        return reject (error);
      }
      //console.log("showPredictions()")
  });
};

const _getDirection = function (configModel, stopTag) {
    const direction = configModel.favorites.find(stop => stop.stop === stopTag).direction;
    return direction === "N" ? "\u00C0" 
        : direction === "NE" ? "\u00C1"
        : direction === "E" ? "\u00C2"
        : direction === "SE" ? "\u00C3"
        : direction === "S" ? "\u00C4"
        : direction === "SW" ? "\u00C5"
        : direction === "W" ? "\u00C6"
        : direction === "NW" ? "\u00C7" : ""
}

const _hasPredictions = function (predictionModel, index) {
  return predictionModel[index].direction;
};

const showLoading = (configModel, weatherModel) => {
  let infoDisplayLine1 = "";
  let infoDisplayLine2 = "";
  let sky = "";

  const d = new Date();
  infoDisplayLine1 = _formatAMPM(d);
  const options = { weekday: 'short', year: '2-digit', month: '2-digit', day: 'numeric' };

  if (weatherModel) {
    const minTemp = weatherService.getMinTemp(weatherModel);
    const maxTemp = weatherService.getMaxTemp(weatherModel);
    sky = weatherService.getSky(weatherModel);
    infoDisplayLine1 += ` ${maxTemp}/${minTemp}`;
  }

  infoDisplayLine2 = `${d.toLocaleDateString("en-US", options).replace(",","")} ${sky}`;

  show(configModel, _center(infoDisplayLine1));
  show(configModel, _center(infoDisplayLine2));
}

const showInit = function () {
  console.log(4);
  sign.send(_center('Registering...'));
  sign.send(_center(ip.address()));
};

const show = function (configModel, string) {
  if (typeof configModel.loaded === 'undefined' || configModel.debug) {
    console.log(_center(string));
  } else {
    sign.send(_center(string));
  }
};

const clear = function (configModel) {
  if (typeof configModel.loaded !== 'undefined' && !configModel.debug) {
    sign.clear();
  }
};


const showError = function (err) {
  console.log(err);
  //writeFile(err);
  sign.send(err);
};

const _formatAMPM = function (date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = `${hours}:${minutes} ${ampm}`;
  return strTime;
};

const stopTimers = function (dataHandle) {
  clearTimeout(dataHandle);
  clearTimeout(displayHandle);
};

const _isArriving = function (minutes) {
  return minutes === '0' ? 'Arriving' : `${minutes} min`;
};

const kill = function() {
  sign.kill();
}

const _center = function (string, charLength = 20) {
  let sidePadding = "";
  if (string.length < 20) {
    //console.log(string);
    const spaceToFill = charLength - string.length;
    const paddingSize = parseInt(Math.floor(spaceToFill / 2));
    const paddingChar = ' ';
    sidePadding = paddingChar.repeat(paddingSize);
  }
  return `${sidePadding}${string}${sidePadding}`;
};

const showShareCarEstimate = (lyftModel, uberModel) => {
  //console.log(lyftModel);
  if (lyftModel) {
    const estimate = Math.ceil(lyftModel.find(a => a.ride_type === "lyft").estimated_duration_seconds / 60);
    const liftLow = lyftModel.find(a => a.ride_type === "lyft").estimated_cost_cents_min / 100;
    const liftHigh = lyftModel.find(a => a.ride_type === "lyft").estimated_cost_cents_max / 100;
    const liftLineLow = lyftModel.find(a => a.ride_type === "lyft_line").estimated_cost_cents_min / 100;
    const liftLineHigh = lyftModel.find(a => a.ride_type === "lyft_line").estimated_cost_cents_max / 100;
    sign.send(_center(`Lyft/Line ${estimate}min`));
    sign.send(_center(`$${liftLow}-${liftHigh} / $${liftLineLow}-${liftLineHigh}`));
  }

  if (uberModel) {
    const estimate = Math.ceil(uberModel.find(a => a.display_name === "UberX").duration / 60);
    const uberLow = uberModel.find(a => a.display_name === "UberX").low_estimate;
    const uberHigh = uberModel.find(a => a.display_name === "UberX").high_estimate;
    const uberPoolLow = uberModel.find(a => a.display_name === "UberPool").low_estimate;
    const uberPoolHigh = uberModel.find(a => a.display_name === "UberPool").high_estimate;
    sign.send(_center(`UberX/Pool ${estimate}min`));
    sign.send(_center(`$${uberLow}-${uberHigh} / $${uberPoolLow}-${uberPoolHigh}`));
  }
}

module.exports = {
  showPredictions,
  stopTimers,
  showError,
  show,
  showLoading,
  showInit,
  showShareCarEstimate,
  clear,
  kill
};
