
const fs = require('fs');
const path = require('path');
const Cache = require('../cache.js');

const configFilePath = path.join(__dirname, '../../config.json');

loadConfig = function () {
  return new Promise((resolve, reject) => {
    fs.readFile(configFilePath, 'utf8', (err, contents) => {
      err ? reject(err) : resolve(contents);
    });
  });
};

debug = function () {
  console.log(JSON.parse(configModel).agencyID);
};

getAllRouteListForAgency = function (agency) {
  fetch(`${domainApi}?command=routeList&a=${agency}`)
    .then(res => res.json())
    .then(json => routeModel = JSON.parse(json));
};

getAllStopsForAllRoutes = function (configModel, routeModel) {
  return Cache.get('routeConfig', `${configModel.domain}?command=routeConfig&a=${configModel.agencyId}`)
    .then(json => json);
};

getPredictions = function (configModel) {
  fs.appendFileSync(path.join(`${__dirname}/../../service.log`), "Getting Predicitons\n");
  return configModel.favorites.length === 0 ? getPredictionsForStopAndRoute(configModel) : getMutiplePredictionsForStopsAndRoutes(configModel);
};

getPredictionsForStopAndRoute = function (configModel) {
  return Cache.get('predictions', `${configModel.domain}?command=predictions&a=${configModel.agencyId}&s=${configModel.favorites.stop}&r=${configModel.favorites.route}`)
    .then(json => json.json())
    .then(json => json.predictions);
};

getMutiplePredictionsForStopsAndRoutes = function (configModel) {
  let stops = '';
  for (let i = 0; i < configModel.favorites.length; i++) {
    stops += `&stops=${configModel.favorites[i].route}|${configModel.favorites[i].stop}`;
  }
  fs.appendFileSync(path.join(`${__dirname}/../../service.log`), `${configModel.domain}?command=predictionsForMultiStops&a=${configModel.agencyId}${stops}\n`);
  return Cache.get('predictionsForMultiStops', `${configModel.domain}?command=predictionsForMultiStops&a=${configModel.agencyId}${stops}`)
    .then(json => json.json())
    .then(json => json.predictions);
};

sendResponse = function (response) {
  response.end();
};

// haveWeBeenHereRencently = function(url) {
//     fs.readdir(__dirname, (err, files) => {
//         files.forEach(file => {
//         console.log(file);
//         });
//     })
//     console.log(files)
// }

module.exports = {
  loadConfig,
  getPredictions,
};
