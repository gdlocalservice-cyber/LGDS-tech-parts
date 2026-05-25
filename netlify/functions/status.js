const { response } = require('./_data');
exports.handler = async () => response(200, { ok: true, message: 'LGDS parts functions are working' });
