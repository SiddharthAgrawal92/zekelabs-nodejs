const PostsRoutes = require('express').Router();
let auth = require('../middlewares/auth.middleware');
const { createPost, getAllPosts, deletePost } = require('../controllers/posts.controllers');


PostsRoutes.get('/', auth, getAllPosts);

PostsRoutes.post('/', auth, createPost);

PostsRoutes.delete('/:id', auth, deletePost);

module.exports = PostsRoutes;