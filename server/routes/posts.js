const router = require("express").Router();
const postsController = require("../controllers/postsController");
const uploadController = require("../controllers/uploadController");
const { upload } = require("../middlewares/upload");
const JWTAuthenticate = require("../middlewares/JWTAuthenticate");

router.route("/")
    .get(postsController.getPosts) //Get multiple posts
    .post(JWTAuthenticate, uploadController.uploadImage, postsController.createPost); //Create post

router.route("/:slug")
    .get(postsController.getPost); //Get single post by [slug]

router.route("/:id")
    .put(JWTAuthenticate, upload.single("file"), postsController.updatePost) //Update post by [id]
    .delete(JWTAuthenticate, postsController.deletePost); //Delete post by [id]

module.exports = router