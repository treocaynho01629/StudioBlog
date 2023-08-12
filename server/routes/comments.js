const router = require("express").Router();
const commentsController = require("../controllers/commentsController");
const JWTAuthenticate = require("../middlewares/JWTAuthenticate");
const commentsValidator = require("../middlewares/validators/commentsValidator");

router.route("/")
    .get(commentsController.getComments); //Get multiple comments

router.route("/:postId")
    .post(commentsValidator.validateComment, commentsController.createComment); //Create comments

router.route("/:id")
    .get(commentsController.getComment) //Get comment by [id]
    .delete(JWTAuthenticate, commentsController.deleteComment); //Delete user by [id]

module.exports = router