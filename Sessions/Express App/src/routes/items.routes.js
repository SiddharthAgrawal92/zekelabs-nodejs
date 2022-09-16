
const itemRoutes = require('express').Router();
const Items = require('../models/items.model');
const { check, validationResult } = require('express-validator');
const auth = require('../middlewares/auth.middleware.js');

/**
 * GET - HTTP method to get all items
 */
itemRoutes.get('/', auth, (req, res) => {
    Items.find({}).exec((err, items) => {
        if (err) {
            console.error(err);
            res.send('Error while fetching items');
        } else {
            res.status(200).json(items);
        }
    })
});

/**
 * GET - HTTP method to get item by ID
 */
itemRoutes.get('/:id', auth, (req, res) => {
    Items.find({ _id: req.params.id }).exec((err, item) => {
        if (err) {
            console.error(err);
            res.send('Error while fetching items');
        } else {
            res.status(200).json(item);
        }
    })
});

/**
 * POST - HTTP method to store the items
 */
itemRoutes.post('/', auth, [
    //validates all chained methods placed before bail() and skips all those placed afterwards
    // check('username', 'provide a proper email').isEmail().bail().isLength({ min: 8, max: 15 })

    //check if field is a valid email
    // check('username', 'provide a proper username').isEmail(),
    // check('username', 'username should be in range 8-15').isLength({ min: 8, max: 15 }),

    //custom validator to compare the two field values
    // check('confirmName', "name and confirm name should be same").isString().custom((val, { req }) => val === req.body.name),

    //case conversion
    // check('desc').toUpperCase()
    // check('desc').toLowerCase(),

    //sanitizes the value by replace <, >, &, ', " and / with HTML entities.
    // check('note').exists().isString().trim().escape(),

    //converts value to an array
    // check('subItems').toArray(), // "value" --> ["value"], ["value"] --> ["value"], undefined: []


    //check if field exists
    check('name', 'this field is required').exists(),
    check('name', "please provide a string").isString(),

    check('type', 'this field is required').exists(),
    //replaces the values in an array list to a specific one
    check('type').replace(["Vegetableee", "Vegetablae"], "Vegetable"),

    check('quantity', 'this field is required').exists(),
    //sets a default value if unavailable
    check('quantity').default(1),

    check('price', 'this field is required').exists(),
    check('price', 'field should be numeric').isNumeric(),

    check('tags', 'this field is required').exists(),
    check('tags', 'field should be an array').isArray()



], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    Items.create(req.body, (err, items) => {
        if (err) {
            console.error(err);
            res.send('Error while storing items');
        } else {
            res.status(200).json(items);
            const socket_io_instance = req.app.get('socket_io_instance');
            socket_io_instance.emit('server_data', items);
        }
    });
});


/**
 * PUT - HTTP method to update the item
 */
itemRoutes.put('/:id', auth, (req, res) => {
    Items.findOneAndUpdate({ _id: req.params.id }, req.body, (err, items) => {
        if (err) {
            console.error(err);
            res.send('Error while storing items');
        } else {
            res.status(200).json(items);
        }
    });
});

// patch('/:id', (req, res)=>{
//     req.body
// })

// let item: {
//     _id: 101,
//     name: "",
//     quantity: 10,
//     price: 12
// }

/**
 * DELETE - HTTP method to delete an item by ID
 */

itemRoutes.delete('/:id', auth, (req, res) => {
    Items.deleteOne({ _id: req.params.id }, (err, data) => {
        if (err) {
            console.error(err);
            res.send('Error while deleting an item');
        } else {
            res.status(200).json(data);
        }
    });
});

/**
 * Delete all items after an ID
 */
itemRoutes.delete('/all/:id', auth, (req, res) => {
    Items.deleteMany({ _id: { $gt: req.params.id } }, (err, data) => {
        if (err) {
            console.error(err);
            res.send('Error while deleting an item');
        } else {
            res.status(200).json(data);
        }
    });
});

module.exports = itemRoutes;