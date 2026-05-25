const ADMIN_PASSWORD = 'GgspnV8y4n!';
const TECH_PASSWORD = '0606';

const initialData = {
  updatedAt: new Date().toISOString(),
  categories: [
    { id: 'torsion-springs', name: 'Torsion System - Springs (pair)', items: [
      { id: 'spring-207-20', name: 'Spring 207-20', price: 56, active: true },
      { id: 'spring-207-23', name: 'Spring 207-23', price: 58, active: true },
      { id: 'spring-207-26', name: 'Spring 207-26', price: 62, active: true },
      { id: 'spring-225-24', name: 'Spring 225-24', price: 64, active: true },
      { id: 'spring-225-27', name: 'Spring 225-27', price: 64, active: true },
      { id: 'spring-243-29', name: 'Spring 243-29', price: 70, active: true },
      { id: 'spring-262-36', name: 'Spring 262-36', price: 90, active: true }
    ]},
    { id: 'torsion-general', name: 'Torsion System - General', items: [
      { id: 'cables-pair-torsion', name: 'Cables (pair)', price: 10, active: true },
      { id: 'drums-pair', name: 'Drums (pair)', price: 25, active: true },
      { id: 'double-drums-pair', name: 'Double Drums (pair)', price: 25, active: true },
      { id: 'end-bearings-pair', name: 'End Bearings (pair)', price: 20, active: true },
      { id: 'middle-bracket-center-bearing', name: 'Middle Bracket + Center Bearing', price: 15, active: true },
      { id: 'tube-9', name: 'Tube 9', price: 25, active: true },
      { id: 'tube-16', name: 'Tube 16', price: 50, active: true },
      { id: 'football-bearing-pair', name: 'Football Bearing (pair)', price: 10, active: true }
    ]},
    { id: 'extension-springs-7f', name: 'Extension System - Springs 7f (pair)', items: [
      { id: '7f-light-blue', name: 'Light Blue', price: 30, active: true },
      { id: '7f-off-white', name: 'Off-White', price: 35, active: true },
      { id: '7f-white', name: 'White', price: 42, active: true },
      { id: '7f-green', name: 'Green', price: 42, active: true },
      { id: '7f-yellow', name: 'Yellow', price: 42, active: true },
      { id: '7f-blue', name: 'Blue', price: 45, active: true },
      { id: '7f-red', name: 'Red', price: 55, active: true },
      { id: '7f-brown', name: 'Brown', price: 60, active: true }
    ]},
    { id: 'extension-springs-8f', name: 'Extension System - Springs 8f (pair)', items: [
      { id: '8f-light-blue', name: 'Light Blue', price: 46, active: true },
      { id: '8f-off-white', name: 'Off-White', price: 46, active: true },
      { id: '8f-white', name: 'White', price: 52, active: true },
      { id: '8f-green', name: 'Green', price: 54, active: true },
      { id: '8f-yellow', name: 'Yellow', price: 56, active: true },
      { id: '8f-blue', name: 'Blue', price: 62, active: true },
      { id: '8f-red', name: 'Red', price: 64, active: true },
      { id: '8f-brown', name: 'Brown', price: 70, active: true }
    ]},
    { id: 'extension-general', name: 'Extension System - General', items: [
      { id: 'cables-pair-extension', name: 'Cables (pair)', price: 10, active: true },
      { id: 'safety-cables-pair', name: 'Safety Cables (pair)', price: 10, active: true },
      { id: 'pulley', name: 'Pulley', price: 6, active: true },
      { id: 'iron-pulley', name: 'Iron Pulley', price: 15, active: true },
      { id: 'shaft-pair', name: 'Shaft (pair)', price: 3, active: true }
    ]},
    { id: 'garage-general', name: 'Garage - General', items: [
      { id: 'silicon-roller-unit', name: 'Silicon Roller / unit', price: 3, active: true },
      { id: 'silicon-roller-pack', name: 'Silicon Roller / 10 pack', price: 30, active: true },
      { id: 'long-silicon-roller-unit', name: 'Long Silicon Roller / unit', price: 3, active: true },
      { id: 'long-silicon-roller-pack', name: 'Long Silicon Roller / 10 pack', price: 30, active: true },
      { id: 'weather-strip-9', name: 'Weather Strip 9', price: 20, active: true },
      { id: 'weather-strip-16', name: 'Weather Strip 16', price: 30, active: true },
      { id: 'strut-9', name: 'Strut 9', price: 25, active: true },
      { id: 'strut-16', name: 'Strut 16', price: 50, active: true },
      { id: 'opener-ch-half', name: 'Opener CH 1/2', price: 225, active: true },
      { id: 'opener-ch-three-quarter-camera', name: 'Opener CH 3/4 Camera', price: 270, active: true },
      { id: 'opener-ch-one-quarter-camera-p', name: 'Opener CH 1 1/4 Camera P', price: 350, active: true },
      { id: 'opener-lm-1-camera', name: 'Opener LM 1 Camera', price: 390, active: true },
      { id: 'hinge-1', name: 'Hinge 1', price: 5, active: true },
      { id: 'hinge-2', name: 'Hinge 2', price: 5, active: true },
      { id: 'hinge-3', name: 'Hinge 3', price: 6, active: true },
      { id: 'hinge-4', name: 'Hinge 4', price: 6, active: true },
      { id: 'remote', name: 'Remote', price: 35, active: true },
      { id: 'keypad', name: 'Keypad', price: 35, active: true },
      { id: 'extension-8f-opener', name: 'Extension 8f (Opener)', price: 70, active: true }
    ]}
  ]
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    },
    body: JSON.stringify(body)
  };
}

async function getStore() {
  const { getStore } = require('@netlify/blobs');
  return getStore({ name: 'lgds-parts-data' });
}

function isAdminPassword(p) { return p === ADMIN_PASSWORD; }
function isTechPassword(p) { return p === TECH_PASSWORD; }

module.exports = { initialData, response, getStore, isAdminPassword, isTechPassword };
