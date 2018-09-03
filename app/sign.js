const script = 'sudo /home/pi/Muni/rpi-rgb-led-matrix/examples-api-use/text-example --led-rows=16 --led-cols=32 --led-chain=3 -S 0 -b 100 -f ./app/muni.bdf -C 177,74,5 --led-parallel=1 --led-pwm-lsb-nanoseconds=50 --led-slowdown-gpio=4';
const { exec } = require('child_process');

let child = exec(script, {uid: 1000} (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
});

// let child;
// const exec = require('child_process').exec;

// child = exec(script, (error, stdout, stderr) => {
//   console.log(`sign error: ${stdout}`);
// });

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
