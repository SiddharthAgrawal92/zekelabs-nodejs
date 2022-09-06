const express = require('express'),
    bodyParser = require('body-parser'),
    routes = require('./routes'),
    cors = require('cors'),
    serveIndex = require('serve-index'),
    mongoose = require('mongoose');

const hostname = '127.0.0.1';
const port = process.env.PORT || 8081;
const mongoConnectionStr = 'mongodb+srv://sid1605:sT2kdICiGGtnsmgz@cluster0.3o8fgzr.mongodb.net/myDb';
const app = express();

class Server {
    constructor() {
        this.initDB();
        this.initViewEngine();
        this.initStaticFiles();
        this.initMiddleWares();
        this.initRoutes();
        this.start();
    }

    initDB() {
        mongoose.connect(mongoConnectionStr);
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'Error: Connecting to DB'));
        db.once('open', () => {
            console.log('Connected to MongoDB Successfully!')
        });
    }

    initMiddleWares() {
        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use('/server', (req, res, next) => {
            console.log(new Date());
            next();
        });
    }

    initStaticFiles() {
        app.use('/public', express.static('public'));
        app.use('/public', serveIndex('public'));
    }

    initViewEngine() {
        // app.use('views', './views');
        // app.use('view engine', 'pug');
        // app.use('view engine', 'jade');
    }

    initRoutes() {
        app.use('/', routes);
    }

    start() {
        app.listen(port, hostname, () => {
            console.log(`Server is running on port: http://${hostname}:${port}`);
        });
    }
}

new Server();