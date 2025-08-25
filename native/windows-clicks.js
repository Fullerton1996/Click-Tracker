const { user32 } = require('ffi-napi');
const ref = require('ref-napi');
const StructType = require('ref-struct-napi');

const HOOKPROC = 'pointer';
const HANDLE = ref.types.void;

// Windows hook types
const WH_MOUSE_LL = 14;
const WM_LBUTTONDOWN = 0x0201;

// Windows hook structure
const MSLLHOOKSTRUCT = StructType({
  pt: StructType({
    x: 'long',
    y: 'long'
  }),
  mouseData: 'uint32',
  flags: 'uint32',
  time: 'uint32',
  dwExtraInfo: 'uint64'
});

const user32Functions = {
  SetWindowsHookExA: ['pointer', ['int32', HOOKPROC, 'pointer', 'uint32']],
  UnhookWindowsHookEx: ['bool', ['pointer']],
  CallNextHookEx: ['int32', ['pointer', 'int32', 'uint32', 'pointer']],
  GetModuleHandleA: ['pointer', ['string']]
};

let hookHandle = null;
let clickCallback = null;

function lowLevelMouseProc(nCode, wParam, lParam) {
  if (nCode >= 0 && wParam === WM_LBUTTONDOWN) {
    if (clickCallback) {
      clickCallback();
    }
  }
  return user32.CallNextHookEx(hookHandle, nCode, wParam, lParam);
}

function trackWindowsClicks(callback) {
  clickCallback = callback;

  // Create hook procedure
  const hookProc = ffi.Callback('int32', ['int32', 'uint32', 'pointer'], lowLevelMouseProc);
  
  // Set Windows hook
  hookHandle = user32.SetWindowsHookExA(
    WH_MOUSE_LL,
    hookProc,
    user32.GetModuleHandleA(null),
    0
  );

  if (!hookHandle) {
    throw new Error('Failed to set Windows hook');
  }

  // Keep hook procedure from being garbage collected
  process.on('exit', () => {
    if (hookHandle) {
      user32.UnhookWindowsHookEx(hookHandle);
    }
  });
}

module.exports = {
  trackWindowsClicks
};