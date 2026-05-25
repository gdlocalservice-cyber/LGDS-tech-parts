const { response, isAdminPassword, isTechPassword } = require('./_data');
exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return response(200, { ok: true });
  try {
    const body = JSON.parse(event.body || '{}');
    const role = body.role;
    const password = String(body.password || '');
    if (role === 'admin' && isAdminPassword(password)) return response(200, { ok: true, role: 'admin' });
    if (role === 'tech' && isTechPassword(password)) return response(200, { ok: true, role: 'tech' });
    return response(401, { ok: false, message: 'Wrong password' });
  } catch (e) {
    return response(500, { ok: false, message: e.message });
  }
};
