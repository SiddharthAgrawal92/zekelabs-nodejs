const http = require('http');
const requestListener = require('./routes.js');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(requestListener);

server.listeners(requestListener);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});