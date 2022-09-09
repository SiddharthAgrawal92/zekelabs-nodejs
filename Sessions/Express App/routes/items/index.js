
const itemRoutes = require('express').Router();
const Items = require('./items.model');
const { check, validationResult } = require('express-validator');

/**
 * GET - HTTP method to get all items
 */
itemRoutes.get('/', (req, res) => {
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
itemRoutes.get('/:id', (req, res) => {
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
itemRoutes.post('/', [
    //check if field exists
    check('username', 'this field is required').exists(),
    
    //validates all chained methods placed before bail() and skips all those placed afterwards
    // check('username', 'provide a proper email').isEmail().bail().isLength({ min: 8, max: 15 })
    
    //check if field is a valid email
    check('username', 'provide a proper username').isEmail(),
    check('username', 'username should be in range 8-15').isLength({ min: 8, max: 15 }),

    check('name', "please provide a string").isString(),
    //custom validator to compare the two field values
    check('confirmName', "name and confirm name should be same").isString().custom((val, { req }) => val === req.body.name),

    //replaces the values in an array list to a specific one
    check('type').replace(["Vegetableee", "Vegetablae"], "Vegetable"),

    //case conversion
    // check('desc').toUpperCase()
    check('desc').toLowerCase(),

    //sanitizes the value by replace <, >, &, ', " and / with HTML entities.
    check('note').exists().isString().trim().escape(),

    //converts value to an array
    check('subItems').toArray(), // "value" --> ["value"], ["value"] --> ["value"], undefined: []
    
    //sets a default value if unavailable
    check('quantity').default(1)


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
        }
    });
});


/**
 * PUT - HTTP method to update the item
 */
itemRoutes.put('/:id', (req, res) => {
    Items.findOneAndUpdate({ _id: req.params.id }, req.body, (err, items) => {
        if (err) {
            console.error(err);
            res.send('Error while storing items');
        } else {
            res.status(200).json(items);
        }
    });
});

/**
 * DELETE - HTTP method to delete an item by ID
 */

itemRoutes.delete('/:id', (req, res) => {
    Items.deleteOne({ _id: req.params.id }, (err, data) => {
        if (err) {
            console.error(err);
            res.send('Error while deleting an item');
        } else {
            res.status(200).json(data);
        }
    });
});

module.exports = itemRoutes;