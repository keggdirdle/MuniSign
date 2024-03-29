const api = require("./api.js");
const configModel = 
{
    loaded: true,
    debug: false,
    mockData: false,
    weather : {
        url: `http://api.openweathermap.org/data/2.5/forecast?zip=94103,us&units=imperial&appid=${api.keys.weatherApiKey}`
    },
    lyft: {
        url: "https://api.lyft.com/v1/cost?start_lat=37.775792&start_lng=-122.4174341&end_lat=37.807222&end_lng=-122.4106743",
        apiKey: api.keys.lyftApiKey
    },
    uber: {
        url: "https://api.uber.com/v1.2/estimates/price?start_latitude=37.7752315&start_longitude=-122.418075&end_latitude=37.7752415&end_longitude=-122.518075",
        apiKey: api.keys.uberApiKey
    },
    agencyId: "sf-muni",
    location: {
        lat: "37.7755913",
        lng: "-122.4169554"
    },
    domain: "http://retro.umoiq.com/service/publicJSONFeed",
    googleAPIKey: api.keys.googleApi,
    cache: {
        display: 3,
        data: 60,
        timeout: 2500
    },
    favorites: [
    {
        route: "49",
        stop: "6817",
        stopTitle: "Van Ness Station Inbound",
        direction: "N"
    },
    {
        route: "9",
        stop: "3243",
        stopTitle: "Van Ness Station Outbound",
        direction: "S"
    },
    {
        route: "14",
        stop: "5545",
        stopTitle: "Mission St & 11th",
        direction: "SW"
    },
    {
        route: "44",
        stop: "5041",
        stopTitle: "Van Ness Outbound",
        direction: "SW"
    }]
}

module.exports = {
    configModel
}
