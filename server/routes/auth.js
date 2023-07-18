const router = require("express").Router();
const authController = require("../controllers/authController");
const JWTAuthenticate = require("../middlewares/JWTAuthenticate");

router.post("/register", authController.register) //Register
router.post("/login", authController.login) //Login
router.post('/refresh', authController.refresh) //Refresh access token
router.delete('/logout', JWTAuthenticate, authController.logout) //Logout

module.exports = router