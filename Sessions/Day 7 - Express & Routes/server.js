const express = require('express'),
    bodyParser = require('body-parser'),
    routes = require('./routes'),
    cors = require('cors');

const app = express();

app.use(cors());

const hostname = '127.0.0.1';
const port = process.env.PORT || 8081;

app.use(bodyParser.json());

app.use('/server', (req, res, next) => {
    console.log(new Date());
    next();
});

app.use('/', routes);

app.listen(port, hostname, () => {
    console.log(`Server is running on port: http://${hostname}:${port}`);
})