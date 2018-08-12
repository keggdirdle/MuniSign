
     let handle;
     
     /**
     * Displays the schedule for the selected routes and stops
     * @param predictionModel This is the JSON response from the API call
     */
    showPredictions = function(predictionModel, index=0) {
        let i = 0;
        handle = setTimeout(() => {
            console.log(`${predictionModel[index].routeTitle}\r\n${_isArriving(predictionModel[index].direction.prediction[0].minutes)} & ${predictionModel[index].direction.prediction[1].minutes} minutes`);
            index === predictionModel.length-1 ? index=0 : index++;
            showPredictions(predictionModel, index);
            },5 * 1000)
    }

    stopPredictions = function() {
        clearTimeout(handle);
    }

    _isArriving = function(minutes) {
        return minutes === "0" ? "Arriving" : `${minutes} minutes`
    }

    module.exports = {
        showPredictions: showPredictions,
        stopPredictions: stopPredictions
    }