const fs = require('fs');
const path = require('path');

// Mock all browser objects
global.window = {
  location: { href: 'http://localhost/' },
  addEventListener: () => {},
  webkitAudioContext: null,
  AudioContext: class {
    createOscillator() { return { type: '', frequency: { setValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
    createGain() { return { gain: { setValueAtTime: () => {}, rampToValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} }; }
    get currentTime() { return 0; }
    get destination() { return {}; }
  }
};

global.localStorage = {
  getItem: (key) => {
    if (key === 'HIPROUST_ORDERS') return '[]';
    return null;
  },
  setItem: () => {}
};

const elements = {};
global.document = {
  documentElement: { lang: '' },
  body: {
    classList: {
      add: () => {},
      remove: () => {}
    },
    id: 'admin-body'
  },
  addEventListener: () => {},
  querySelectorAll: (selector) => {
    return [];
  },
  getElementById: (id) => {
    if (!elements[id]) {
      elements[id] = {
        id: id,
        innerText: '',
        innerHTML: '',
        value: 'daily',
        checked: false,
        children: [], // MOCK CHILDREN ARRAY
        style: {},
        classList: {
          add: () => {},
          remove: () => {}
        },
        appendChild: (child) => {
          // console.log(`[DOM] appendChild to ${id}`);
        },
        querySelector: () => {
          return { value: '', innerText: '', innerHTML: '' };
        },
        querySelectorAll: () => []
      };
    }
    return elements[id];
  },
  createElement: (tag) => {
    return {
      style: {},
      classList: {
        add: () => {},
        remove: () => {}
      },
      innerHTML: '',
      children: [], // MOCK CHILDREN ARRAY
      appendChild: () => {},
      setAttribute: () => {},
      addEventListener: () => {}
    };
  }
};

// Load app.js
const appJsPath = path.join(__dirname, '..', 'app.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');

// Execute code
console.log("Executing app.js in mocked environment...");
try {
  eval(appJsContent);
  console.log("app.js executed successfully!");
} catch (e) {
  console.error("Crash during execution of app.js:", e);
  process.exit(1);
}

// Run each render function to see if it throws an error!
const renderFunctions = [
  'renderAdminDashboard',
  'renderAdminKitchenKDS',
  'renderAdminCashierTill',
  'renderAdminTablesGrid',
  'renderAdminCategoriesPanel',
  'renderAdminCustomersRoster',
  'renderAdminInventoryStock',
  'renderAdminEmployeesRoster',
  'renderAdminReportsPanel',
  'renderAdminAnalyticsCharts',
  'renderAdminNotificationsCenter',
  'renderAdminAuditLogs'
];

console.log("\nTesting render functions...");
let allPassed = true;
for (const fnName of renderFunctions) {
  try {
    const fn = eval(fnName);
    if (typeof fn === 'function') {
      console.log(`Running ${fnName}()...`);
      fn();
      console.log(`  ${fnName}() passed!`);
    } else {
      console.error(`  ${fnName} is not a function or not defined!`);
      allPassed = false;
    }
  } catch (e) {
    console.error(`  ${fnName}() CRASHED!`, e);
    allPassed = false;
  }
}

if (allPassed) {
  console.log("\nALL 12 ADMIN RENDER FUNCTIONS PASSED SUCESSFULLY!");
} else {
  console.error("\nSOME RENDER FUNCTIONS CRASHED.");
  process.exit(1);
}
