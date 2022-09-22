const PostsRoutes = require('express').Router();
let auth = require('../middlewares/auth.middleware');
const { createPost, getAllPosts, deletePost } = require('../controllers/posts.controllers');
const { getAllPostsValidator } = require('../validators/posts.validators');

PostsRoutes.get('/', auth, getAllPostsValidator, getAllPosts);

PostsRoutes.post('/', auth, createPost);

PostsRoutes.delete('/:id', auth, deletePost);

module.exports = PostsRoutes;