const { spawn } = require('child_process');

let clickCallback = null;
let xinputProcess = null;

function parseXinputOutput(data) {
  const output = data.toString();
  if (output.includes('button press') && output.includes('detail: 1')) {
    // detail: 1 indicates left mouse button
    if (clickCallback) {
      clickCallback();
    }
  }
}

function trackLinuxClicks(callback) {
  clickCallback = callback;

  // Get list of input devices
  const xinputList = spawn('xinput', ['list']);
  let deviceId = null;

  xinputList.stdout.on('data', (data) => {
    const devices = data.toString().split('\n');
    // Find the first mouse device
    for (const device of devices) {
      if (device.toLowerCase().includes('mouse')) {
        const match = device.match(/id=(\d+)/);
        if (match) {
          deviceId = match[1];
          break;
        }
      }
    }

    if (deviceId) {
      // Monitor mouse events
      xinputProcess = spawn('xinput', ['test', deviceId]);

      xinputProcess.stdout.on('data', parseXinputOutput);

      xinputProcess.stderr.on('data', (data) => {
        console.error(`xinput error: ${data}`);
      });

      xinputProcess.on('close', (code) => {
        console.log(`xinput process exited with code ${code}`);
      });
    }
  });

  xinputList.stderr.on('data', (data) => {
    console.error(`xinput list error: ${data}`);
  });

  // Cleanup on exit
  process.on('exit', () => {
    if (xinputProcess) {
      xinputProcess.kill();
    }
  });
}

module.exports = {
  trackLinuxClicks
};
