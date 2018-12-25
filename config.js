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
    domain: "http://webservices.nextbus.com/service/publicJSONFeed",
    googleAPIKey: api.keys.googleApi,
    cache: {
        display: 3,
        data: 60,
        timeout: 10000
    },
    favorites: [{
        route: "47",
        stop: "5545",
        stopTitle: "Mission St & 11th St",
        direction: "N"
    },
    {
        route: "F",
        stop: "5652",
        stopTitle: "Market St & 9th St - Inbound",
        direction: "NE"
    },
    {
        route: "76X",
        stop: "6833",
        direction: "N"
    },
    {
        route: "90",
        stop: "5545",
        direction: "N"
    },
    {
        route: "14",
        stop: "5544",
        direction: "NE"
    },
    {
        route: "N",
        stop: "5419",
        stopTitle: "Van Ness Station Inbound",
        direction: "NE"
    },
    {
        route: "N",
        stop: "6996",
        stopTitle: "Van Ness Station Outbound",
        direction: "SW"
    },
    {
        route: "J",
        stop: "6996",
        stopTitle: "Van Ness Station Outbound",
        direction: "SW"
    },
    {
        route: "N_OWL",
        stop: "5696",
        direction: "W"
    },{
        route: "21",
        stop: "6501",
        stopTitle: "Market St & 9th St",
        direction: "W"
    }]
}

module.exports = {
    configModel
}
