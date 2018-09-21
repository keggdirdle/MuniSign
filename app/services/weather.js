const Cache = require('../cache.js');

getForcast = function (configModel) {
  return Cache.get('forcast', `${configModel.weather.url}`)
    .then(json => JSON.parse(json))
    .then(json => json.list);
};

module.exports = {
  getForcast,
};
