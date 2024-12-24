
module.exports = {
  'GET /api/foo': (req, res) => {
    res.json({
      data: ['foo', 'bar'],
    });
  },
};
