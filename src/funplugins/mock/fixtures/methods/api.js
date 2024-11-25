module.exports = {
  'GET /api/users': () => {
    return { users: [{ id: 1, name: 'foo' }] };
  },
  'POST /api/users': () => {
    return { success: true };
  },
  'PUT /api/users/1': () => {
    return { success: true };
  },
};
