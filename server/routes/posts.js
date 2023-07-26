const router = require("express").Router();
const { upload } = require("../middlewares/upload");
const postsController = require("../controllers/postsController");
const uploadController = require("../controllers/uploadController");
const postsValidator = require("../middlewares/validators/postsValidator");
const JWTAuthenticate = require("../middlewares/JWTAuthenticate");

router.route("/")
    .get(postsController.getPosts) //Get multiple posts
    .post(JWTAuthenticate, 
        uploadController.uploadImage, 
        postsController.createPost) //Create post | I gave up on validate field :<
    .patch(JWTAuthenticate, postsValidator.validatePost); //Validate post field cuz f multer

router.route("/:slug")
    .get(postsController.getPost); //Get single post by [slug]

router.route("/:id")
    .put(JWTAuthenticate, 
        upload.single("file"), 
        postsController.updatePost) //Update post by [id]
    .delete(JWTAuthenticate, uploadController.deleteImage, postsController.deletePost); //Delete post by [id]

module.exports = router