const routes = require('express').Router();
const itemRoutes = require('./items');

routes.get('/', (req, res) => {
    // res.render('index.pug', { name: 'sid', message: "This message is send from server" });
    // res.render('index2.jade', { name: 'sid', message: "This message is send from server" });
    res.send('Connected!');
});

routes.use('/items', itemRoutes);

routes.get('*', (req, res) => {
    res.status(404).send('Sorry, this URI is not supported by our app!');
});

routes.post('*', (req, res) => {
    res.status(404).send('Sorry, this URI is not supported by our app!');
});

module.exports = routes;

// index.js
// routes.get('/product/:id', async (req, res) => {
//     const productID = req.params.id;
//     const result = await getProducts(productID);
//     res.send(result);
// })

//db.js
// getProducts(productID){
//     const fetchedData = await client.db('myDb').collection('products').find({ _id: ObjectId(productID) });
//     return fetchedData;
// }


//Hardware shop
// POST - Endpoint to store mutiple
// products metadata: {
//     name: String,
//     barcodeORuniqueId: String,
//     quantiy: Number,
//     tags: ['Peripheral', "Wire"]
// }

//GET - All Products - /products

//GET - Get Product By ID - /products/:id OR /products?id=<<your_id>>

//PUT - Update multiple records of multiple categories - /products?category=cat1,cat2 BODY: {quantiy: Number}

//PUT - Update a single - /products/:id BODY: {quantiy: Number}

//delete - Delete all products - /products - fire a delete of products collection

//delete - Delete a single product - /products/:id
