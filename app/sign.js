const script = 'sudo /home/pi/Muni/rpi-rgb-led-matrix/examples-api-use/text-example --led-rows=16 --led-cols=32 --led-chain=3 -S 0 -b 100 -f ./app/muni.bdf -C 177,74,5 --led-parallel=1 --led-pwm-lsb-nanoseconds=50 --led-slowdown-gpio=4';
const fs = require('fs');
const path = require('path');

let child;
const exec = require('child_process').exec;

child = exec(script, (error, stdout, stderr) => {
  fs.appendFileSync(path.join(`${__dirname}/../service.log`), `${new Date()} + \n Sign Error...: ${stdout} \n `);
  console.log(`sign error: ${stdout}`);
});

send = function (string) {
  setTimeout(() => {
    child.stdin.write(`${string}\n`);
  }, 50);
};

clear = function () {
  child.stdin.write('\n');
};

module.exports = {
  send,
  clear,
};
