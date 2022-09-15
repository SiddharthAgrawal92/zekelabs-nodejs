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
    Posts.find({}).exec((err, posts) => {
        if (err) {
            return res.status(500).send({ err: 'Something went wrong' });
        } else {
            res.status(201).send({ result: posts });
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