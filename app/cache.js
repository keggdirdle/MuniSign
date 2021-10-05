const request = require('request');
//const axios = require('axios');
const fs = require('fs');
//const DisplayFunctions = require('./display');

const log4js = require('log4js');
const now = new Date();
log4js.configure({
  appenders: { muni: { type: 'file', filename: `./logs/cache.log` } },
  categories: { default: { appenders: ['muni'], level: 'error' } }
});

const logger = log4js.getLogger();

var maxRequest = request.defaults({
  pool: {
    keepAlive: true,
    maxSockets: Infinity
  }
})

// const get = async (configModel, key, uri, auth = "") => {
//     try {
//         logger.debug(uri);
//       const response = await axios.get(uri, 
//         { headers: 
//             { 
//                 Authorization: auth 
//             }
//             // ,
//             // httpAgent: new http.Agent({ keepAlive: true }),
//             // httpsAgent: new https.Agent({ keepAlive: true })
//         })
//       .catch((e) => {
//         logger.error(e);
//       })
//       return response.data;
      
//     } catch (error) {
//         logger.error(error);
//         console.error(error);
//     }
// }

// const get = (configModel, key, uri, auth) => {
//   return new Promise((resolve, reject) => {
//     request(uri, (err, response, body) => {
//       if (err) {
//         reject(err);
//       }

//       //console.log(body);
//       const result = JSON.parse(body);
//       if (body === undefined){
//         throw new Error('FAIL');
//       }

//       resolve(result);
//     });
//   });
// }

const get = (configModel, key, uri, auth) => {
  //logger.debug('getting URL', uri);
  return new Promise((resolve, reject) => {
    maxRequest.get(
      { 
        headers: { 'Authorization': auth },
        url: uri, 
        forever: true, 
        agent: false,
        timeout: configModel.cache.timeout
      }, function(error, response, body) { 
    if (!error && response.statusCode == 200) { 
      return resolve(JSON.parse(response.body));      
      } else {
        //response.end()
        return reject(error);
    }
    }).on('end', function() {
      return;
    }).on('error', function(error){
      //response.end();
      return reject(error);
    }).end();
  })
};

// if (err) {
//   throw new Error(`Weather: ${err}`);
// }

// const result = JSON.parse(body);
// if (result.main === undefined){
//   throw new Error('Weather: failed to get weather data, please try again.');
// }

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
