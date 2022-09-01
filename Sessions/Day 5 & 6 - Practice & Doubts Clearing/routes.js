const url = require('url');
const { getItems, insertItem, updateItem, deleteItem } = require('./db.js');

const requestListener = (req, res) => {
    switch (req.method) {
        case 'GET':
            handleGetReq(req, res);
            break;
        case 'POST':
            handlePostReq(req, res);
            break;
        case 'PUT':
            handlePutReq(req, res);
            break;
        case 'DELETE':
            handleDeleteReq(req, res);
            break;
        default:
            res.writeHead(404);
            res.end(JSON.stringify({ error: "Sorry, this HTTP method is yet not supported by our server!" }));
    }
}

const handleGetReq = async (req, res) => {
    const parsedURL = url.parse(req.url, true);

    if (parsedURL.pathname == '/items') {
        let data = await getItems(parseInt(parsedURL.query.record), parseInt(parsedURL.query.skip));
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end(JSON.stringify(data));
    }
}

const handlePostReq = (req, res) => {
    const parsedURL = url.parse(req.url, true);
    if (parsedURL.pathname == '/items') {
        let payload = '';
        req.on('data', (chunk) => {
            payload += chunk;
        });
        req.on('end', async () => {
            payload = JSON.parse(payload);
            const result = await insertItem(payload);
            res.setHeader("Content-Type", "application/json");
            res.writeHead(200);
            res.end(JSON.stringify(result));
        });
    }
}

const handlePutReq = (req, res) => {
    const parsedURL = url.parse(req.url, true);
    if (parsedURL.pathname == '/items') {
        let payload = '';
        req.on('data', (chunk) => {
            payload += chunk;
        });
        req.on('end', async () => {
            payload = JSON.parse(payload);
            const result = await updateItem(parsedURL.query.id, payload);
            res.setHeader("Content-Type", "application/json");
            res.writeHead(200);
            res.end(JSON.stringify(result));
        });
    }
}

const handleDeleteReq = async (req, res) => {
    const parsedURL = url.parse(req.url, true);
    if (parsedURL.pathname == '/items') {
        const result = await deleteItem(parsedURL.query.id);
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end(JSON.stringify(result));
    }
}



module.exports = requestListener;