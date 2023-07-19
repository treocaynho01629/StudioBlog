const router = require("express").Router();
const postsController = require("../controllers/postsController");
const uploadController = require("../controllers/uploadController");
const { upload } = require("../middlewares/upload");
const JWTAuthenticate = require("../middlewares/JWTAuthenticate");

router.route("/")
    .get(postsController.getPosts) //Get multiple posts
    .post(JWTAuthenticate, uploadController.uploadImage, postsController.createPost); //Create post

router.route("/:slug")
    .get(postsController.getPost) //Get single post by [slug]
    .put(JWTAuthenticate, upload.single("file"), postsController.updatePost) //Update post by [slug]
    .delete(JWTAuthenticate, postsController.deletePost); //Delete post by [slug]

module.exports = router