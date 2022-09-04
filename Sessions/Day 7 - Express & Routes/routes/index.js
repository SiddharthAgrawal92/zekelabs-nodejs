const routes = require('express').Router();

routes.get('/', (req, res) => {
    console.log('Request Query Params:', req.query);
    res.send('Connected!');
});

routes.get('/items/:id', (req, res) => {
    console.log('Request Path Params:', req.params);
    res.send('Connected!');
});

routes.get('/items/:id/:name', (req, res) => {
    console.log('Request Path Params:', req.params);
    res.send('Connected!');
});

routes.post('/items', (req, res) => {
    console.log('Request Body:', req.body);
    res.send(req.body);
});

routes.get('*', (req, res) => {
    res.status(404).send('Sorry, this URI is not supported by our app!');
});

routes.post('*', (req, res) => {
    res.status(404).send('Sorry, this URI is not supported by our app!');
});

module.exports = routes;