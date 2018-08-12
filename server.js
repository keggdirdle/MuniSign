const http = require('http');
const SignFunctions  = require("./service");
const DisplayFunctions = require("./display");

let configModel = {}
let routeModel = {}
let predicitonModel = {};
let counter = 5

let workflow = {
    doYourDoYourStuff: function() {
        counter--;

        SignFunctions.loadConfig()
        .then(
            resp => {
                configModel = JSON.parse(resp)
                return Promise.all([configModel, SignFunctions.getPredictions(configModel)]); 
            }
        )
        .then((resp) => {
            predicitonModel = resp[1];
        })
        .then(() => {
            DisplayFunctions.stopPredictions();
            DisplayFunctions.showPredictions(predicitonModel);
        })
        .catch((err) => console.log(err))

        if (counter > 0) {
            setTimeout(() => workflow.doYourDoYourStuff(), 1 * 60 * 1000);
        }
    }
}

workflow.doYourDoYourStuff()

onRequest = function(request, response) {

    if (request.url === '/favicon.ico') {
        response.writeHead(200, {'Content-Type': 'image/x-icon'} );
        response.end();
        return;
      }

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    workflow.doYourDoYourStuff(response);
    
    //all stops for all routes (takes a long time)
    //http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=sf-muni

    //all predictions for a specific stop
    //http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=sf-muni&stopId=15545


    //single route, single stop
    //http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=sf-muni&s=5545&r=47

    //multiple rounts, single stop
    //http://webservices.nextbus.com/service/publicJSONFeed?command=predictionsForMultiStops&a=sf-muni&stops=47|5545&stops=N|3909

    //get distances from current address (with my Google API key)
    //https://developers.google.com/maps/documentation/distance-matrix/intro#DistanceMatrixRequests
    //https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=37.775632099999996,-122.4173286&destinations=37.77431%2C-122.4172899&key=AIzaSyAh7BtUc6rMb3flhrDmvusoTWLnM48_MBY
} 
http.createServer(onRequest).listen(8000);


//workflow
//get regional agency
//http://webservices.nextbus.com/service/publicXMLFeed?command=agencyList 

//get all routes for agency
//http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=sf-muni

//get all stops for route
//http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=sf-muni

    //get locations for all stops
    //https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=37.775632099999996,-122.4173286&destinations=37.77431%2C-122.4172899&key=AIzaSyAh7BtUc6rMb3flhrDmvusoTWLnM48_MBY

//get 3-4 closest stops

//get routes for those stops
//http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=sf-muni&stopId=15545

//get predictions for those routes and stops
//http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=sf-muni&s=5545&r=47

//local config file
//agencyID, lat long, refresh speed