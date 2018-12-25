const Cache = require('../cache.js');
const DisplayFunctions = require('../display');

getCostEstimate = async (configModel) => {
    return await Cache.get(configModel, 'lyft', configModel.lyft.url, `Bearer ${configModel.lyft.apiKey}`)
    .then(json => json.cost_estimates)
}

module.exports = {
    getCostEstimate,
};