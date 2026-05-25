const { ADMIN_PASSWORD, TECH_PASSWORD, json, createToken } = require('./shared');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  try {
    const body = JSON.parse(event.body || '{}');
    const role = body.role;
    const password = body.password;
    if (role === 'admin' && password === ADMIN_PASSWORD) return json(200, { token: createToken('admin'), role: 'admin' });
    if (role === 'tech' && password === TECH_PASSWORD) return json(200, { token: createToken('tech'), role: 'tech' });
    return json(401, { error: 'Wrong password' });
  } catch (error) {
    return json(400, { error: 'Bad request' });
  }
};
