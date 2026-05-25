const { json } = require('./shared');
exports.handler = async () => json(200, { ok: true, message: 'LGDS parts functions are working' });
