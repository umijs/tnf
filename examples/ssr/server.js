const express = require('express');
const app = express();

app.use((req, res, next) => {
  if (req.url === '/' || req.url === '/foo') {
    return require('./dist/server.js').render(req, res);
  }
  next();
});

app.use(express.static('dist'));

app.listen(7001, () => {
  console.log('Server is running on http://localhost:7001');
});
