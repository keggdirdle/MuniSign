const Cache = require('../cache.js');
const DisplayFunctions = require('../display');


const log4js = require('log4js');
const now = new Date();
log4js.configure({
  appenders: { muni: { type: 'file', filename: `./logs/server.log` } },
  categories: { default: { appenders: ['muni'], level: 'error' } }
});

const logger = log4js.getLogger();

getCostEstimate = async (configModel) => {
    return await Cache.get(configModel, 'uber', configModel.uber.url,`Token ${configModel.uber.apiKey}`)
    .then(json => json.prices)
    .catch((err) =>  { throw new Error(err) })
}

module.exports = {
    getCostEstimate,
};