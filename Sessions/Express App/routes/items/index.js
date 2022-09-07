
const itemRoutes = require('express').Router();
const Items = require('./items.model');

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
itemRoutes.post('/', (req, res) => {
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