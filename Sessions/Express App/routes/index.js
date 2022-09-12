const routes = require('express').Router();
const itemRoutes = require('./items');
const UserRoutes = require('./users');
const AuthRoutes = require('./auth');
const path = require('path');

routes.get('/', (req, res) => {
    res.render('index3', { name: 'sid', message: "This message is send from server" });
    // res.render('index', { name: 'sid', message: "This message is send from server" });
    // res.render('index2', {
    //     name: 'sid', message: "This message is send from server", myList: [
    //         {
    //             name: 'Sid'
    //         },
    //         {
    //             name: 'John'
    //         },
    //         {
    //             name: 'Peter'
    //         },
    //         {
    //             name: 'Mark'
    //         }, {
    //             name: 'Charlie'
    //         }
    //     ]
    // });
    // res.send('Connected!');
});

routes.use('/items', itemRoutes);

routes.use('/user', UserRoutes);

routes.use('/auth', AuthRoutes);

/**
 * one way to handle invalid routes but this needs to be handled for every http methods
 */
// routes.get('*', (req, res) => {
//     res.status(404).send('Sorry, this URI is not supported by our app!');
// });

// routes.post('*', (req, res) => {
//     res.status(404).send('Sorry, this URI is not supported by our app!');
// });

/**
 * This can handle all http methods
 */
routes.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../htmlFile/notFound.html'));
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
