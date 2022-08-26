
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
        // fsp.readFile('./home.html', 'utf-8').then(data => {
        //     res.setHeader("Content-Type", "text/html")
        //     res.writeHead(200);
        //     res.end(data);
        // });
        res.setHeader('Content-Type', 'text/plain');
        res.writeHead(200);
        fs.createReadStream('./sample-2mb-text-file.txt').pipe(res);

    }
    else if (parsedUrl.pathname == '/reviews-airbnb') {
        getReviews(res);
    }
    else if (parsedUrl.pathname == '/video') {
        const range = req.headers.range;
        if (!range) {
            res.status(400).send('Requested range not available');
        }
        const videoPath = './garden.mp4';
        const videoSize = fs.statSync('./garden.mp4').size;
        const CHUNK_SIZE = 10 ** 6;
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Range": "bytes",
            "Content-Length": contentLength,
            "Content-Type": 'video/mp4'
        }
        res.writeHead(206, headers);
        const videoStream = fs.createReadStream(videoPath, { start, end });
        videoStream.pipe(res);
    }
}

const getReviews = () => {
    //fetching reviews from local file
    let reviews = JSON.parse(fs.readFileSync('./reviews.json', 'utf8'));
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify({ items: reviews }));


    // constructing url query-params using string split method manually
    // let newPathname = parsedUrl.path.split('?');
    // newPathname = newPathname[1].split('=');
    // const noOfRecords = newPathname[1];

    // fetching url query-params using 'query' of url.parse()        

    // let reviews = await getAirBnbReviews(parseInt(parsedUrl.query.record));
    // res.setHeader("Content-Type", "application/json")
    // res.writeHead(200);
    // res.end(JSON.stringify({ items: reviews }));
}

module.exports = requestListener;