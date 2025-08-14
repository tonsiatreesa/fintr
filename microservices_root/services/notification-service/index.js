const http = require('http');
const port = process.env.PORT || 4007;
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({service: 'notification-service', path: req.url}));
});
server.listen(port, () => console.log(`notification-service listening ${port}`));
