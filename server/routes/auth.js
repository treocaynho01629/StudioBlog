const router = require("express").Router();
const authController = require("../controllers/authController");
const loginLimiter = require("../middlewares/loginLimiter");
const usersValidator = require("../middlewares/validators/usersValidator");
const JWTAuthenticate = require("../middlewares/JWTAuthenticate");

router.post("/register", usersValidator.validateUser, authController.register) //Register
router.post("/login", loginLimiter, authController.login) //Login
router.get("/refresh", authController.refresh) //Refresh access token
router.delete("/logout", JWTAuthenticate, authController.logout) //Logout

module.exports = router