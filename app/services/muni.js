const Cache = require('../cache.js');
const DisplayFunctions = require('../display');

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
    .then(json => json.predictions);
};

getMutiplePredictionsForStopsAndRoutes = async (configModel) => {
  //return new Promise((resolve, reject) => {
    let stops = '';
    for (let i = 0; i < configModel.favorites.length; i++) {
      stops += `&stops=${configModel.favorites[i].route}|${configModel.favorites[i].stop}`;
    }
    //DisplayFunctions.showError("getting from cache for stops" + stops);
    return await Cache.get(configModel,'predictionsForMultiStops', `${configModel.domain}?command=predictionsForMultiStops&a=${configModel.agencyId}${stops}`)
    .then((json) => {
      return json.predictions;
    });
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
