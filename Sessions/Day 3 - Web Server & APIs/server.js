const http = require('http');
const requestListener = require('./routes');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(requestListener);

server.listen(port, hostname, () => {
    console.log(`Server is running on: http://${hostname}:${port}`);
});