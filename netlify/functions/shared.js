const crypto = require('crypto');

const ADMIN_PASSWORD = 'GgspnV8y4n!';
const TECH_PASSWORD = '0606';
const TOKEN_SECRET = process.env.LGDS_PARTS_TOKEN_SECRET || 'lgds-local-parts-calculator-basic-secret-2026';
const STORE_NAME = 'lgds-parts-calculator';
const DATA_KEY = 'parts-data';

const seedData = {
  updatedAt: new Date().toISOString(),
  categories: [
    {
      id: 'torsion-springs',
      name: 'Torsion System - Springs / מערכת תורשן - קפיצים',
      items: [
        { id: 'spring-207-20', name: 'Spring 207-20 / קפיץ 207-20', price: 56, active: true },
        { id: 'spring-207-23', name: 'Spring 207-23 / קפיץ 207-23', price: 58, active: true },
        { id: 'spring-207-26', name: 'Spring 207-26 / קפיץ 207-26', price: 62, active: true },
        { id: 'spring-225-24', name: 'Spring 225-24 / קפיץ 225-24', price: 64, active: true },
        { id: 'spring-225-27', name: 'Spring 225-27 / קפיץ 225-27', price: 64, active: true },
        { id: 'spring-243-29', name: 'Spring 243-29 / קפיץ 243-29', price: 70, active: true },
        { id: 'spring-262-36', name: 'Spring 262-36 / קפיץ 262-36', price: 90, active: true }
      ]
    },
    {
      id: 'torsion-general',
      name: 'Torsion System - General / מערכת תורשן - כללי',
      items: [
        { id: 'cables-pair-torsion', name: 'Cables pair / כבלים זוג', price: 10, active: true },
        { id: 'drums-pair', name: 'Drums pair / תופים זוג', price: 25, active: true },
        { id: 'double-drums-pair', name: 'Double Drums pair / תופים כפולים זוג', price: 25, active: true },
        { id: 'end-bearings-pair', name: 'End Bearings pair / מיסבי קצה זוג', price: 20, active: true },
        { id: 'middle-bracket-center-bearing', name: 'Middle Bracket + Center Bearing / סוגר אמצעי + מיסב מרכזי', price: 15, active: true },
        { id: 'tube-9', name: 'Tube 9 / צינור 9', price: 25, active: true },
        { id: 'tube-16', name: 'Tube 16 / צינור 16', price: 50, active: true },
        { id: 'football-bearing-pair', name: 'Football Bearing pair / מיסב פוטבול זוג', price: 10, active: true }
      ]
    },
    {
      id: 'extension-springs-7f',
      name: 'Extension System - Springs 7f pair / מערכת מתיחה - קפיצים 7f זוג',
      items: [
        { id: 'extension-7-light-blue', name: 'Light Blue / כחול בהיר', price: 30, active: true },
        { id: 'extension-7-off-white', name: 'Off-White / שמנת', price: 35, active: true },
        { id: 'extension-7-white', name: 'White / לבן', price: 42, active: true },
        { id: 'extension-7-green', name: 'Green / ירוק', price: 42, active: true },
        { id: 'extension-7-yellow', name: 'Yellow / צהוב', price: 42, active: true },
        { id: 'extension-7-blue', name: 'Blue / כחול', price: 45, active: true },
        { id: 'extension-7-red', name: 'Red / אדום', price: 55, active: true },
        { id: 'extension-7-brown', name: 'Brown / חום', price: 60, active: true }
      ]
    },
    {
      id: 'extension-springs-8f',
      name: 'Extension System - Springs 8f pair / מערכת מתיחה - קפיצים 8f זוג',
      items: [
        { id: 'extension-8-light-blue', name: 'Light Blue / כחול בהיר', price: 46, active: true },
        { id: 'extension-8-off-white', name: 'Off-White / שמנת', price: 46, active: true },
        { id: 'extension-8-white', name: 'White / לבן', price: 52, active: true },
        { id: 'extension-8-green', name: 'Green / ירוק', price: 54, active: true },
        { id: 'extension-8-yellow', name: 'Yellow / צהוב', price: 56, active: true },
        { id: 'extension-8-blue', name: 'Blue / כחול', price: 62, active: true },
        { id: 'extension-8-red', name: 'Red / אדום', price: 64, active: true },
        { id: 'extension-8-brown', name: 'Brown / חום', price: 70, active: true }
      ]
    },
    {
      id: 'extension-general',
      name: 'Extension System - General / מערכת מתיחה - כללי',
      items: [
        { id: 'cables-pair-extension', name: 'Cables pair / כבלים זוג', price: 10, active: true },
        { id: 'safety-cables-pair', name: 'Safety Cables pair / כבלי בטיחות זוג', price: 10, active: true },
        { id: 'pulley', name: 'Pulley / גלגלת', price: 6, active: true },
        { id: 'iron-pulley', name: 'Iron Pulley / גלגלת ברזל', price: 15, active: true },
        { id: 'shaft-pair', name: 'Shaft pair / ציר זוג', price: 3, active: true }
      ]
    },
    {
      id: 'garage-general',
      name: 'Garage - General / גראז׳ - כללי',
      items: [
        { id: 'silicon-roller-single', name: 'Silicon Roller - single unit / גלגלת סיליקון יחידה', price: 3, active: true },
        { id: 'silicon-roller-pack', name: 'Silicon Roller - 10 units pack / גלגלת סיליקון חבילה 10 יחידות', price: 30, active: true },
        { id: 'silicon-roller-long-single', name: 'Long Silicon Roller - single unit / גלגלת סיליקון ארוכה יחידה', price: 3, active: true },
        { id: 'silicon-roller-long-pack', name: 'Long Silicon Roller - 10 units pack / גלגלת סיליקון ארוכה חבילה 10 יחידות', price: 30, active: true },
        { id: 'weather-strip-9', name: 'Weather Strip 9 / פס הידוק 9', price: 20, active: true },
        { id: 'weather-strip-16', name: 'Weather Strip 16 / פס הידוק 16', price: 30, active: true },
        { id: 'strut-9', name: 'Strut 9 / תמך 9', price: 25, active: true },
        { id: 'strut-16', name: 'Strut 16 / תמך 16', price: 50, active: true },
        { id: 'opener-ch-half', name: 'Opener CH 1/2 / מנוע CH 1/2', price: 225, active: true },
        { id: 'opener-ch-three-quarter-camera', name: 'Opener CH 3/4 Camera / מנוע CH 3/4 מצלמה', price: 270, active: true },
        { id: 'opener-ch-one-quarter-camera-p', name: 'Opener CH 1 1/4 Camera P / מנוע CH 1 1/4 מצלמה P', price: 350, active: true },
        { id: 'opener-lm-1-camera', name: 'Opener LM 1 Camera / מנוע LM 1 מצלמה', price: 390, active: true },
        { id: 'hinge-1', name: 'Hinge 1 / ציר 1', price: 5, active: true },
        { id: 'hinge-2', name: 'Hinge 2 / ציר 2', price: 5, active: true },
        { id: 'hinge-3', name: 'Hinge 3 / ציר 3', price: 6, active: true },
        { id: 'hinge-4', name: 'Hinge 4 / ציר 4', price: 6, active: true },
        { id: 'remote', name: 'Remote / שלט', price: 35, active: true },
        { id: 'keypad', name: 'Keypad / לוח מקשים', price: 35, active: true },
        { id: 'extension-8f-opener', name: 'Extension 8f Opener / הארכה 8f מנוע', price: 70, active: true }
      ]
    }
  ]
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body)
  };
}

function b64url(input) {
  return Buffer.from(input).toString('base64url');
}

function sign(payload) {
  return crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
}

function createToken(role) {
  const payload = b64url(JSON.stringify({ role, exp: Date.now() + 1000 * 60 * 60 * 12 }));
  return `${payload}.${sign(payload)}`;
}

function verifyToken(authHeader, roleRequired) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  const [payload, signature] = token.split('.');
  if (!payload || !signature || sign(payload) !== signature) return null;
  const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  if (!data.exp || Date.now() > data.exp) return null;
  if (roleRequired === 'admin' && data.role !== 'admin') return null;
  if (roleRequired === 'techOrAdmin' && !['admin', 'tech'].includes(data.role)) return null;
  return data;
}

function getBlobStore() {
  const { getStore } = require('@netlify/blobs');
  return getStore(STORE_NAME);
}

async function getData() {
  const store = getBlobStore();
  const existing = await store.get(DATA_KEY, { type: 'json' });
  if (existing && existing.categories) return existing;
  await store.setJSON(DATA_KEY, seedData);
  return seedData;
}

async function saveData(data) {
  const clean = {
    updatedAt: new Date().toISOString(),
    categories: (data.categories || []).map((category) => ({
      id: String(category.id || crypto.randomUUID()),
      name: String(category.name || '').trim() || 'Untitled Category',
      items: (category.items || []).map((item) => ({
        id: String(item.id || crypto.randomUUID()),
        name: String(item.name || '').trim() || 'Untitled Item',
        price: Number(item.price || 0),
        active: item.active !== false
      }))
    }))
  };
  const store = getBlobStore();
  await store.setJSON(DATA_KEY, clean);
  return clean;
}

module.exports = { ADMIN_PASSWORD, TECH_PASSWORD, json, createToken, verifyToken, getData, saveData, seedData };
