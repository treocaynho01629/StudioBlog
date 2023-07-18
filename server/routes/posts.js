require("dotenv").config();
const router = require("express").Router();
const postsController = require("../controllers/postsController");
const JWTAuthenticate = require("../middlewares/JWTAuthenticate");

router.route("/")
    .get(postsController.getPosts) //Get multiple posts
    .post(JWTAuthenticate, postsController.createPost); //Create post

router.route("/:slug")
    .get(postsController.getPost) //Get single post by [slug]
    .delete(JWTAuthenticate, postsController.deletePost) //Delete post by [slug]
    .put(JWTAuthenticate, postsController.updatePost); //Update post by [slug]

module.exports = router