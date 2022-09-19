const practiceRoutes = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const { MongoClient } = require('mongodb');
const Device = require('../models/practice.model');

practiceRoutes.get('/getBulkData', auth, async (req, res) => {
    const mongoConnectionStr = 'mongodb+srv://sid1605:sT2kdICiGGtnsmgz@cluster0.3o8fgzr.mongodb.net/sample_airbnb';
    const dbClient = new MongoClient(mongoConnectionStr);
    await dbClient.connect().catch(err => { console.error(err) });
    const result = await dbClient.db('sample_airbnb').collection('listingsAndReviews').find().limit(50).toArray();
    res.send({ result: result });
});

practiceRoutes.post('/random-values', auth, (req, res) => {
    const packets = [];
    if (req.body.count) {
        for (let i = 0; i < req.body.count; i++) {
            packets.push({
                temperature: Math.floor(Math.random() * 100), //Math.random()
                batteryLevel: Math.floor(Math.random() * 100), //Math.random()
                timeStamp: new Date(2022, 5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)) //Math.random() - hint: new Date(param1, param2, param3, param4, parma5)
            })
        }
    } else {
        return res.status(422).send({ msg: 'Count is required' });
    }
    Device.insertMany(packets, { returnOriginal: true }).then(result => {
        result = Array.isArray(result) ? result : [result];
        res.send({ result: result });
        if (result.length > 20) {
            result.splice(20);
        }
        io = req.app.get('socket_io_instance');
        io.emit('new-packets', result);
    });
});

practiceRoutes.get('/random-values', auth, (req, res) => {
    const { count, startDate, endDate } = req.query;
    if (startDate && endDate && count) {
        const filter = {
            timeStamp: {
                $gte: startDate,
                $lte: endDate
            }
        }
        Device.find({}).where(filter).limit(req.query.count).exec((err, data) => {
            res.send({ result: data });
        });
    } else if (!startDate && !endDate && count) {
        Device.find({}).limit(req.query.count).exec((err, data) => {
            res.send({ result: data });
        });
    } else if (startDate && endDate && !count) {
        const filter = {
            timeStamp: {
                $gte: startDate,
                $lte: endDate
            }
        }
        Device.find({}).where(filter).exec((err, data) => {
            res.send({ result: data });
        });
    } else if ((!startDate && !endDate && !count) && (startDate && !endDate && !count) && (!startDate && endDate && !count)) {
        res.status(422).send({ msg: 'startDate & EndDate OR count Or all three are required' });
    }
})

module.exports = practiceRoutes;