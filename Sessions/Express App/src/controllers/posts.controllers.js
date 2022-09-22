const Posts = require("../models/posts.model")

const createPost = (req, res) => {
    Posts.create(req.body, (err, postedData) => {
        if (err) {
            return res.status(400).send({ err: err.errors });
        } else {
            res.status(201).send({ result: postedData });
            const io = req.app.get('socket_io_instance');
            io.emit('server_data', postedData);
        }
    })
}

const getAllPosts = (req, res) => {
    // const filters = {
    //     updated: {
    //         $gte: new Date(2022, 8, 16), // 16-sep-2022 00:00
    //         $lte: new Date(2022, 8, 17) // 17-sep-2022 00:00
    //     }
    // }
    // Posts.find({}).where(filters).exec((err, posts) => {
    let sortObj = {};
    if (req.query.sortBy && req.query.sortOrder) {
        sortObj = { [req.query.sortBy]: parseInt(req.query.sortOrder) };
    }
    // .sort({field_1: -1, field_2: 1}) 
    // -- sorting will work on first field first and if 2 or more has same 
    //value in "field_1" then it will move to "field_2" for the sorting
    // 22/9/2022-00:00:00 ABC 
    // 22/9/2022-00:00:00 XYZ
    Posts.find({}).sort(sortObj).exec((err, posts) => {
        if (err) {
            return res.status(500).send({ err: 'Something went wrong' });
        } else {
            res.status(200).send({ result: posts });
        }
    })
}


const deletePost = (req, res) => {
    Posts.deleteOne({ _id: req.params.id }, (err, result) => {
        if (err) {
            return res.status(500).send({ err: 'Something went wrong' });
        } else {
            if (result.acknowledged && result.deletedCount) {
                res.status(200).send({ result: result });
                const io = req.app.get('socket_io_instance');
                io.emit('post-deleted', req.params.id);
            } else {
                res.status(500).send({ err: 'We don\'t find any post with that ID' });
            }
        }
    })
}

module.exports = {
    createPost,
    getAllPosts,
    deletePost
}