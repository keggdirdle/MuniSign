const fetch = require('node-fetch'); // npm install node-fetch --save
const fs = require('fs');
const path = require('path');

get = function (key, url, err) {
  fs.appendFileSync(path.join(`${__dirname}/../service.log`), `Gettin...: ${url} \n `);
  return fetch(url);
};

set = function (key, url) {
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
