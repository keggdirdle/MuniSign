const fetch = require('node-fetch'); //npm install node-fetch --save
const fs = require('fs');


    get = function(key, url, err) {
        return fetch(url)
    }

    set = function(key, url) {
        fetch(url)
        .then(res => res.json())
        .then(json => {
            fs.writeFile(`sf-muni-${key}.json`, JSON.stringify(json), (err) => {
                if (err) {
                    throw err;
                }
            })
        })
        .then(
            json => {return json}
        )
        
}

module.exports = {
    get: get
}
