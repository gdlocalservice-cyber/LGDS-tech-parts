const { response, getStore, isAdminPassword } = require('./_data');
exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return response(200, { ok: true });
  if (event.httpMethod !== 'POST') return response(405, { ok: false, message: 'POST only' });
  try {
    const body = JSON.parse(event.body || '{}');
    if (!isAdminPassword(String(body.adminPassword || ''))) {
      return response(401, { ok: false, message: 'Admin password required' });
    }
    if (!body.data || !Array.isArray(body.data.categories)) {
      return response(400, { ok: false, message: 'Invalid data' });
    }
    const data = { ...body.data, updatedAt: new Date().toISOString() };
    const store = await getStore();
    await store.setJSON('parts', data);
    return response(200, { ok: true, data });
  } catch (e) {
    return response(500, { ok: false, message: e.message });
  }
};
