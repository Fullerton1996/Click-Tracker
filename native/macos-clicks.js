const { spawn } = require('child_process');
const path = require('path');

let clickCallback = null;
let clickMonitor = null;

function trackMacOSClicks(callback) {
  clickCallback = callback;

  // Path to the compiled Objective-C helper binary
  const helperPath = path.join(__dirname, '../bin/click-monitor');

  clickMonitor = spawn(helperPath);

  clickMonitor.stdout.on('data', (data) => {
    const event = data.toString().trim();
    if (event === 'click' && clickCallback) {
      clickCallback();
    }
  });

  clickMonitor.stderr.on('data', (data) => {
    console.error(`Click monitor error: ${data}`);
  });

  clickMonitor.on('close', (code) => {
    console.log(`Click monitor process exited with code ${code}`);
  });

  process.on('exit', () => {
    if (clickMonitor) {
      clickMonitor.kill();
    }
  });
}

module.exports = {
  trackMacOSClicks
};
