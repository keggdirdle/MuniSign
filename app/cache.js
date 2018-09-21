const request = require('request');
const fs = require('fs');
//const DisplayFunctions = require('./display');

// const log4js = require('log4js');
// const now = new Date();
// log4js.configure({
//   appenders: { muni: { type: 'file', filename: `./logs/cache.log` } },
//   categories: { default: { appenders: ['muni'], level: 'debug' } }
// });

//const logger = log4js.getLogger();

var maxRequest = request.defaults({
  pool: {maxSockets: Infinity}
})

const get = (configModel, key, uri, err) => {
  return new Promise((resolve, reject) => {
    maxRequest.get({ url: uri, forever: true, agent: false, timeout: configModel.cache.timeout }, function(error, response, body) { 
    if (!error && response.statusCode == 200) { 
      const now = new Date();
      //logger.info(`Date: ${response.headers["date"]} Length:${response.headers["content-length"]}`);
      return resolve(response.body);      
      } else { 
      return reject(error);
    }
    });
  })
};

const set = function (key, url) {
  fetch(url)
    .then(res => res.json())
    .then((json) => {
      fs.writeFile(`sf-muni-${key}.json`, JSON.stringify(json), (err) => {
        if (err) {
          throw err;
        }
      });
    })
    .then(
      json => json,
    );
};

module.exports = {
  get,
};
