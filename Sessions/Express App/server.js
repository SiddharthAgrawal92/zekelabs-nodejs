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
    });

const hostname = '127.0.0.1';
const port = process.env.PORT || 8081;
const mongoConnectionStr = 'mongodb+srv://sid1605:sT2kdICiGGtnsmgz@cluster0.3o8fgzr.mongodb.net/myDb';
const app = express();

class Server {
    constructor() {
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
        io.on('connection', socket => {
            socket.emit('socket_message', { msg: '🙏Welcome to our chat 🙏' });
            socket.on('new-user', name => {
                // console.log(`New user ${name} is connected to the socket!`);
                users[socket.id] = name;
                socket.broadcast.emit('user-connected', name);
            });
            socket.on('client_message', msg => {
                socket.broadcast.emit('socket_message', { msg: msg, username: users[socket.id] });
            });
            socket.on('disconnect', () => {
                socket.broadcast.emit('user-disconnected', users[socket.id]);
                delete users[socket.id];
            })
        })
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
        app.set('views', './views');
        // app.set('view engine', 'pug');
        // app.set('view engine', 'jade');
        app.set('view engine', 'vash');
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
//use case 1 - login from server
//frontend app
// http://frontend=-app.com

//login.pug
// username
// password

//use case 2 - Server side rendering

