const script = 'sudo /home/pi/Muni/rpi-rgb-led-matrix/examples-api-use/text-example --led-rows=16 --led-cols=32 --led-chain=3 -S 0 -b 50 -f ./app/muni.bdf -C 255,155,5 --led-parallel=1 --led-pwm-lsb-nanoseconds=50 --led-slowdown-gpio=4 --led-pwm-lsb-nanoseconds=50';
const { exec } = require('child_process');

const rows = 2;
const signWidth = 19;
const signHistory = [];

const child = exec(script, (error, stdout, stderr) => {
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('exit', (status) => {
      let msg = message;
      if (status !== 0) {
        console.error('command', cmd);
        msg = null;
      }
      //resolve(msg);
    });
    // if (error) {
    //     console.error(`exec error: ${error}`);
    //     return;
    // }
});

const kill = () => {

    //const cmd = (`/home/pi/Muni/rpi-rgb-led-matrix/examples-api-use/text-example`) 

  return new Promise((resolve, reject) => {
    const child = exec(script);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('exit', (status) => {
      let msg = message;
      if (status !== 0) {
        console.error('command', script);
        msg = null;
      }
      resolve(msg);
    });
  });
};

const send = (string) => {
    //signHistory.push(string);
    //const line1;
    //const line2;
    //if (signHistory.length%2) {
    //    line1 = string;
    //    const line2 = signHistory[signHistory-1];
    //} else {

    //}   
    setTimeout(() => {
        //if(string.length > signWidth) {
           // for (let i=0;i<string.length-signWidth+1;i++) {
               // let displayString = string.substring(i,signWidth+i);
               // setTimeout(() => {
                   // clear();
                   // child.stdin.write(`${displayString}\n`);
               // },150 * i)    
           // }
       //} else {
            child.stdin.write(`${string}\n`);
       //}
    }, 0);
};

const clear = () => {
    child.stdin.write('\n');
};

module.exports = {
    send,
    clear,
    kill
};
