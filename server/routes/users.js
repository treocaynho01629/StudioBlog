const router = require("express").Router();
const usersController = require("../controllers/usersController");
const JWTAuthenticate = require("../middlewares/JWTAuthenticate");

router.use(JWTAuthenticate);

router.route("")
    .get(usersController.getUsers); //Get all users

router.route("/:id")
    .get(usersController.getUser) //Get user by [id]
    .put(usersController.updateUser) //Update user by [id]
    .delete(usersController.deleteUser); //Delete user by [id]

module.exports = router