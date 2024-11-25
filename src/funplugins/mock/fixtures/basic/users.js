module.exports = {
  '/api/users': () => {
    return { users: [{ id: 1, name: 'foo' }] };
  },
  '/api/users/1': [{ id: 1, name: 'foo' }],
};
