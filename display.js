
let dataHandle;
let timeHandle;
    
/**
 * Displays the schedule for the selected routes and stops
 * @param predictionModel This is the JSON response from the API call
 */
showPredictions = function(configModel, predictionModel, index=0) {
    let i = 0;
    let output = "";
    if (predictionModel[index] && predictionModel[index].direction && predictionModel[index].direction.prediction && predictionModel[index].direction.prediction[0]) {
        output += `${predictionModel[index].routeTitle} ${predictionModel[index].stopTitle}\r\n${_isArriving(predictionModel[index].direction.prediction[0].minutes)}`
    }
    if (predictionModel[index] && predictionModel[index].direction && predictionModel[index].direction.prediction && predictionModel[index].direction.prediction[1]) {
        output += ` & ${predictionModel[index].direction.prediction[1].minutes} min`
    }
    if (output !== "") {
        dataHandle = setTimeout(() => {   
            console.log(output);
            index === predictionModel.length-1 ? index=0 : index++;
            showPredictions(configModel,predictionModel, index);
            },configModel.cache.display * 1000)
    } else {
        dataHandle = setTimeout(() => {   
            index === predictionModel.length-1 ? index=0 : index++;
            showPredictions(configModel,predictionModel, index);
            },10)
    }
} 

showTime = function() {
    timeHandle = setTimeout(()=>{
        var d = new Date();
        var time = d.toLocaleTimeString();
        console.log(time);
    },0)
}

stopTimers = function() {
    clearTimeout(dataHandle);
    clearTimeout(timeHandle);
} 

_isArriving = function(minutes) {
    return minutes === "0" ? "Arriving" : `${minutes} min`
}

module.exports = {
    showPredictions: showPredictions,
    showTime: showTime,
    stopTimers: stopTimers
}