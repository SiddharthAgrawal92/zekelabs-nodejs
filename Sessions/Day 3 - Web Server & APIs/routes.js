
const url = require('url');
const fs = require('fs');
const fsp = require('fs').promises;
const { getDatabases, getAirBnbReviews } = require('./db.js');

const requestListener = (req, res) => {
    switch (req.method) {
        case 'GET':
            handleGetReq(req, res);
            break;
        default:
            res.writeHead(404);
            res.end(JSON.stringify({ Error: "Resource Not Found!" }));
    }
}

const handleGetReq = async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    if (parsedUrl.pathname == '/') {
        // res.setHeader("Content-Type", "application/json")
        // res.writeHead(200);
        // res.end(JSON.stringify({ Hello: "World" }));

        // reading a local html file and sending it to client using 'fs' module
        // fs.readFile('./home.html', 'utf-8', (err, data) => {
        //     res.setHeader("Content-Type", "text/html")
        //     res.writeHead(200);
        //     res.end(data);
        // });

        // reading a local html using 'fs/promises'
        fsp.readFile('./home.html', 'utf-8').then(data => {
            res.setHeader("Content-Type", "text/html")
            res.writeHead(200);
            res.end(data);
        });

    }
    else if (parsedUrl.pathname == '/reviews-airbnb') {
        //fetching reviews from local file
        // let reviews = JSON.parse(fs.readFileSync('./reviews.json', 'utf8'));
        // res.setHeader("Content-Type", "application/json")
        // res.writeHead(200);
        // res.end(JSON.stringify({ items: reviews }));

        // constructing url query-params using string split method manually
        // let newPathname = parsedUrl.path.split('?');
        // newPathname = newPathname[1].split('=');
        // const noOfRecords = newPathname[1];

        // fetching url query-params using 'query' of url.parse()
        const noOfRecords = url.parse(req.url, true).query.record;

        let reviews = await getAirBnbReviews(parseInt(noOfRecords));
        res.setHeader("Content-Type", "application/json")
        res.writeHead(200);
        res.end(JSON.stringify({ items: reviews }));
    }
}

module.exports = requestListener;