const router = require("express").Router();
const usersController = require("../controllers/usersController");
const JWTAuthenticate = require("../middlewares/JWTAuthenticate");
const usersValidator = require("../middlewares/validators/usersValidator");

router.use(JWTAuthenticate);

router.route("")
    .get(usersController.getUsers) //Get all users
    .post(usersValidator.validateUser, usersController.createUser); //Create user

router.route("/:id")
    .get(usersController.getUser) //Get user by [id]
    .put(usersValidator.validateUpdateUser, usersController.updateUser) //Update user by [id]
    .delete(usersController.deleteUser); //Delete user by [id]

module.exports = router