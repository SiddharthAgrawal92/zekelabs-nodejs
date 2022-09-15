
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express'),
    bodyParser = require('body-parser'),
    routes = require('./routes'),
    cors = require('cors'),
    serveIndex = require('serve-index'),
    mongoose = require('mongoose'),
    io = require('socket.io')(8085, {
        cors: {
            origin: '*'
        }
    }),
    fs = require('fs'),
    winston = require('winston'),
    expressWinston = require('express-winston'),
    cookieParser = require('cookie-parser'),
    helmet = require('helmet'),
    compression = require('compression'),
    path = require('path');

const mongoConnectionStr = 'mongodb+srv://sid1605:sT2kdICiGGtnsmgz@cluster0.3o8fgzr.mongodb.net/myDb';
const app = express();

class Server {
    constructor() {
        this.initExpressWinstonLogger();
        this.initDB();
        this.initSocketConnection();
        this.initViewEngine();
        this.initStaticFiles();
        this.initMiddleWares();
        this.initRoutes();
        this.start();
    }

    initSocketConnection() {
        // let clientIntervalForRecPackets = null;
        // io.on('connection', socket => {
        //     //frontend triggered event 'client_evt is captured to send the IOT data packets on an interval set by client
        //     socket.on('client_evt', clientMsg => {
        //         clientIntervalForRecPackets = setInterval(() => {
        //             socket.emit('server_data', { _ver: 1, evt: 'coordinate', lat: (Math.random() * 100).toFixed(2), log: (Math.random() * 100).toFixed(2) });
        //         }, clientMsg.interval);
        //     });
        //     socket.on('disconnect', () => {
        //         if (clientIntervalForRecPackets) {
        //             clientIntervalForRecPackets.close();
        //         }
        //     })
        // });
        const users = {};
        io.on('connection', clientSocket => { //handshake connection
            clientSocket.emit('socket_message', { msg: '🙏Welcome to our chat 🙏' });
            clientSocket.on('new-user', name => {
                // console.log(`New user ${name} is connected to the socket!`);
                users[socket.id] = name;
                clientSocket.broadcast.emit('user-connected', name);
            });
            clientSocket.on('client_message', msg => {
                clientSocket.broadcast.emit('socket_message', { msg: msg, username: users[clientSocket.id] });
            });
            clientSocket.on('disconnect', () => {
                clientSocket.broadcast.emit('user-disconnected', users[clientSocket.id]);
                delete users[clientSocket.id];
            });
        });
        app.set('socket_io_instance', io);
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
        app.use(helmet());
        app.use(cookieParser());
        app.use(compression({
            level: 9
        }));
        app.use(cors((req, cb) => {
            let options = { credentials: false, origin: false };
            if (process.env.WHITELISTED_ORIGINS.indexOf(req.headers.origin) !== -1) {
                options.credentials = true;
                options.origin = true;
            }
            cb(null, options);
        }));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use('/', (req, res, next) => {
            fs.appendFile(path.join(__dirname, '../logs/apiCalls.log'), `${JSON.stringify({
                url: req.url,
                method: req.method,
                origin: req.headers.origin,
                userAgent: req.headers['User-Agent'],
                host: req.headers.host,
                body: req.body,
                query: req.params
            })}\n`, 'utf-8', (err) => {
                if (err) throw err;
            })
            next();
        });
    }

    initExpressWinstonLogger() {
        app.use(expressWinston.logger({
            transports: [
                new winston.transports.File({ filename: path.join(__dirname, '../logs/logs.log') })
            ],
            format: winston.format.combine(
                winston.format.json(),
                winston.format.colorize(),
            ),
            meta: true,
            msg: "HTTP {{req.method}} {{req.url}}",
            expressFormat: true,
            colorize: true,
            ignoredRoutes: ['/auth/login', '/user/register'],
            headerBlacklist: ['x-access-token', 'cookie']
        }))
    }

    initStaticFiles() {
        app.use('/public', express.static(path.join(__dirname, '../public')));
        app.use('/public', serveIndex(path.join(__dirname, '../public')));
    }

    initViewEngine() {
        app.set('views', './views');
        // app.set('view engine', 'pug');
        // app.set('view engine', 'jade');
        app.set('view engine', 'vash');
    }

    initRoutes() {
        app.use('/', routes);
    }

    start() {
        app.listen(process.env.PORT, process.env.HOSTNAME, () => {
            console.log(`Server is running on port: http://${process.env.HOSTNAME}:${process.env.PORT}`);
        });
    }
}

new Server();
//use case 1 - login from server
//frontend app
// http://frontend=-app.com

//login.pug
// username
// password

//use case 2 - Server side rendering

