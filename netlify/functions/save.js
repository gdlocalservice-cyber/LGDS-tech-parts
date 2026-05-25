const { json, verifyToken, saveData } = require('./shared');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  const user = verifyToken(event.headers.authorization || event.headers.Authorization, 'admin');
  if (!user) return json(401, { error: 'Admin only' });
  try {
    const body = JSON.parse(event.body || '{}');
    const saved = await saveData(body);
    return json(200, saved);
  } catch (error) {
    return json(500, { error: 'Could not save data' });
  }
};
