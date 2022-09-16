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
    //req.body = {
    //  count: 20
    // }
    const packets = [];
    if (req.body.count) {
        for (let i = 0; i < req.body.count; i++) {
            packets.push({
                temperature: Number, //Math.random()
                batteryLevel: Number, //Math.random()
                timeStamp: Date //Math.random() - hint: new Date(param1, param2, param3, param4, parma5)
            })
        }
    } else {
        return res.status(422).send({ msg: 'Count is required' });
    }
    Device.insertMany(packets, { returnOriginal: true }).then(result => {
        res.send({ result: result });
    });
})

module.exports = practiceRoutes;