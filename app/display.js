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

let dataHandle;
let timeHandle;

/**
 * Displays the schedule for the selected routes and stops
 * @param configModel This is the JSON from the static config file
 * @param predictionModel This is the JSON response from the API call
 */
const showPredictions = function (configModel, predictionModel, index = 0) {
  //showError("in show Preds");
  const i = 0;
  let output = '';
  let output2 = '';
  if (_hasPredictions(predictionModel, index)) {
    //logger.info(`building output for the ${index}th time`);
    output += `${predictionModel[index].routeTitle}`;
    if (predictionModel[index].direction[0]) {
      if (predictionModel[index].direction[0].prediction[0]) {
        output2 += `${_isArriving(predictionModel[index].direction[0].prediction[0].minutes)}`;
      } else if (predictionModel[index].direction[0].prediction) {
        output2 += `${_isArriving(predictionModel[index].direction[0].prediction.minutes)}`;
      }

      if (predictionModel[index].direction[0].prediction[1]) {
        output2 += ` & ${predictionModel[index].direction[0].prediction[1].minutes} min`;
      }
    } else {

      if (predictionModel[index].direction.prediction[0]) {
        output2 += `${_isArriving(predictionModel[index].direction.prediction[0].minutes)}`;
      } else if (predictionModel[index].direction.prediction) {
        output2 += `${_isArriving(predictionModel[index].direction.prediction.minutes)}`;
      }

      if (predictionModel[index].direction.prediction[1]) {
        output2 += ` & ${predictionModel[index].direction.prediction[1].minutes} min`;
      }
    }
  }
  if (output !== '') {
    dataHandle = setTimeout(() => {
      _clear(configModel);
      show(configModel, output);
      show(configModel, output2);
      index === predictionModel.length - 1 ? index = 0 : index++;
      showPredictions(configModel, predictionModel, index);
    }, configModel.cache.display * 1000);
  } else {
    dataHandle = setTimeout(() => {
      index === predictionModel.length - 1 ? index = 0 : index++;
      showPredictions(configModel, predictionModel, index);
    }, 10);
  }
};

const writeFile = function(str) {
	fs.appendFile('sign.log', str + "\n", (err) => {});
}

const _hasPredictions = function (predictionModel, index) {
  return predictionModel[index].direction;
};

const showLoading = (configModel) => {
  const d = new Date();
  const time = _formatAMPM(d);
  show(configModel, _center(time));
}

const showInit = function () {
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

const _clear = function (configModel) {
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

const stopTimers = function () {
  clearTimeout(dataHandle);
  clearTimeout(timeHandle);
};

const _showWeather = function (configModel, weatherModel) {
  if (weatherModel.length) {
    const display = `Temp: ${Math.ceil(weatherModel[0].main.temp)} ${weatherModel[0].weather[0].main}`;
    show(configModel, display);
  }
};

const getWeather = function (configModel) {
  //showError("calling weather");
  return weatherService.getForcast(configModel);
};

const _isArriving = function (minutes) {
  return minutes === '0' ? 'Arriving' : `${minutes} min`;
};

const _center = function (string, charLength = 20) {
  const spaceToFill = charLength - string.length;
  const paddingSize = parseInt(Math.floor(spaceToFill / 2));
  const paddingChar = ' ';
  const sidePadding = paddingChar.repeat(paddingSize);
  return `${sidePadding}${string}${sidePadding}`;
};

module.exports = {
  showPredictions,
  stopTimers,
  showError,
  getWeather,
  show,
  showLoading,
  showInit
};
