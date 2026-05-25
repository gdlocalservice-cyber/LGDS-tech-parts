const { initialData, response, getStore } = require('./_data');
exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return response(200, { ok: true });
  try {
    const store = await getStore();
    let data = await store.get('parts', { type: 'json' });
    if (!data) {
      data = initialData;
      await store.setJSON('parts', data);
    }
    return response(200, { ok: true, data });
  } catch (e) {
    return response(200, { ok: true, data: initialData, warning: 'Using default data: ' + e.message });
  }
};
