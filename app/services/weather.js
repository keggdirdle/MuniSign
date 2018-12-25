//const ConfigService = require('./config');
const Cache = require('../cache.js');


const getForcast = async (configModel) => {
  return await Cache.get(configModel, 'forcast', `${configModel.weather.url}`)
  .then(json => json.list)
  // return new Promise((resolve, reject) => {
  //   //ConfigService.loadConfig()
  //   //.then((configModel) => {
  //     return Cache.get(configModel, 'forcast', `${configModel.weather.url}`)
  //     .then((json) => {
  //       return resolve(json.list);
  //     })
  //     .catch((err) => {
  //       return reject(err);
  //     })
  //   //})
  // });
}

const getMinTemp = (weatherModel, date = new Date()) => {
  let minTemp = [];
  weatherModel.forEach((point) => { 
    var now = date;
    var utcTime = new Date(point.dt_txt + " UTC"); 
    if(utcTime.toLocaleDateString() === now.toLocaleDateString()) {
      minTemp.push(parseInt(point.main.temp_min));
    } 
    if (!minTemp.length) {
      now.setDate(now.getDate() + 1);
      getMinTemp(weatherModel, now);
    }
  })
  return Math.min(...minTemp);
}

const getMaxTemp = (weatherModel, date = new Date()) => {
  let maxTemp = [];
  weatherModel.forEach((point) => { 
    var now = date;
    var utcTime = new Date(point.dt_txt + " UTC"); 
    if(utcTime.toLocaleDateString() === now.toLocaleDateString()) {
      maxTemp.push(parseInt(point.main.temp_max));
    } 
    if (!maxTemp.length) {
      now.setDate(now.getDate() + 1);
      getMaxTemp(weatherModel, now);
    }
  })
  return Math.max(...maxTemp);
}

const getSky = (weatherModel) => {
  //clear
  //rain
  //Clouds
  return weatherModel[0].weather[0].main
}

module.exports = {
  getForcast,
  getMinTemp,
  getMaxTemp,
  getSky
};
