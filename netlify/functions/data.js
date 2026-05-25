const { json, verifyToken, getData } = require('./shared');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });
  const user = verifyToken(event.headers.authorization || event.headers.Authorization, 'techOrAdmin');
  if (!user) return json(401, { error: 'Unauthorized' });
  try {
    const data = await getData();
    if (user.role === 'tech') {
      return json(200, {
        ...data,
        categories: data.categories.map(c => ({ ...c, items: c.items.filter(i => i.active !== false) }))
      });
    }
    return json(200, data);
  } catch (error) {
    return json(500, { error: 'Could not load data' });
  }
};
