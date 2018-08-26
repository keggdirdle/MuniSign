const sign = require("./sign.js");

let dataHandle;
let timeHandle;
    
/**
 * Displays the schedule for the selected routes and stops
 * @param predictionModel This is the JSON response from the API call
 */
showPredictions = function(configModel, predictionModel, index=0) {
    let i = 0;
    let output = "";
    let output2 = "";
    if (_hasPredictions(predictionModel, index)) {
        output += `${predictionModel[index].routeTitle}`
        if(predictionModel[index].direction[0]) {
            if (predictionModel[index].direction[0].prediction[0]) {
                output2 += `${_isArriving(predictionModel[index].direction[0].prediction[0].minutes)}`
            } else {
                output2 += ` & ${_isArriving(predictionModel[index].direction[0].prediction.minutes)}`
            }
            if (predictionModel[index].direction[0].prediction[1]) {
                output2 += ` & ${predictionModel[index].direction[0].prediction[1].minutes} min`
            }
        } else {
            if (predictionModel[index].direction.prediction[0]) {
                output2 += `${_isArriving(predictionModel[index].direction.prediction[0].minutes)}`
            }
            if (predictionModel[index].direction.prediction[1]) {
                output2 += ` & ${predictionModel[index].direction.prediction[1].minutes} min`
            }
        }
    }
    if (output !== "") {
        dataHandle = setTimeout(() => {  
            if(configModel.debug) {
                console.log(_center(output)); 
                console.log(_center(output2)); 
            } else {
                sign.clear();
                sign.send(_center(output));
                sign.send(_center(output2));
            }
            index === predictionModel.length-1 ? index=0 : index++;
            showPredictions(configModel,predictionModel, index);
            },configModel.cache.display * 1000)
    } else {
        dataHandle = setTimeout(() => {   
            index === predictionModel.length-1 ? index=0 : index++;
            showPredictions(configModel,predictionModel, index);
            },10)
    }
};

_hasPredictions = function(predictionModel, index) {
    return predictionModel[index].direction;
};

showTime = function() {
    timeHandle = setTimeout(()=>{
        var d = new Date();
        var time = _formatAMPM(d);
            sign.send(_center(time));
    },0)
};

showError = function(err) {
    console.log(err);
}

_formatAMPM = function(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
};

stopTimers = function() {
    clearTimeout(dataHandle);
    clearTimeout(timeHandle);
};

_isArriving = function(minutes) {
    return minutes === "0" ? "Arriving" : `${minutes} min`
};

_center = function(string, charLength = 20) {
    const spaceToFill = charLength - string.length;
    const paddingSize = parseInt(Math.floor(spaceToFill/2));
    const paddingChar = ` `;
    const sidePadding = paddingChar.repeat(paddingSize);
    return `${sidePadding}${string}${sidePadding}`;
}

module.exports = {
    showPredictions: showPredictions,
    showTime: showTime,
    stopTimers: stopTimers,
    showError: showError
};