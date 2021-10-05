const Cache = require('../cache.js');
const DisplayFunctions = require('../display');
const log4js = require('log4js');

log4js.configure({
  appenders: { muni: { type: 'file', filename: `./logs/muni.log` } },
  categories: { default: { appenders: ['muni'], level: 'debug' } }
});
const logger = log4js.getLogger();

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
  //DisplayFunctions.showError("calling getMutiplePredictionsForStopsAndRoutes");
  return configModel.favorites.length === 0 ? getPredictionsForStopAndRoute(configModel) : getMutiplePredictionsForStopsAndRoutes(configModel);
};

getPredictionsForStopAndRoute = async (configModel) => {
  return await Cache.get(configModel, 'predictions', `${configModel.domain}?command=predictions&a=${configModel.agencyId}&s=${configModel.favorites.stop}&r=${configModel.favorites.route}`)
    .then(json => json.predictions)
    .catch((err) =>  { throw new Error(err) })
};

getMutiplePredictionsForStopsAndRoutes = async (configModel) => {
 // logger.debug('running 1');
  //return new Promise((resolve, reject) => {
    let stops = '';
    for (let i = 0; i < configModel.favorites.length; i++) {
      stops += `&stops=${configModel.favorites[i].route}|${configModel.favorites[i].stop}`;
    }
    //DisplayFunctions.showError("getting from cache for stops" + stops);
    return await Cache.get(configModel,'predictionsForMultiStops', `${configModel.domain}?command=predictionsForMultiStops&a=${configModel.agencyId}${stops}`)
    .then((json) => {
      //logger.debug('running 2', json);
      DisplayFunctions
      return json.predictions;
    })
    .catch((err) =>  { throw new Error(err) })
    //.catch((err) => {
      //return reject(err);
    //});
  //});
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
  getPredictions,
};
