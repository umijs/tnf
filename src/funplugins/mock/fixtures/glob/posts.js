module.exports = {
  '/api/posts': () => {
    return { posts: [{ id: 1, title: 'post 1' }] };
  },
  '/api/posts/1': () => {
    return { id: 1, title: 'post 1' };
  },
};
