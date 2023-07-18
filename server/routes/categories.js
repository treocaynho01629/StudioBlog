const router = require("express").Router();
const categoriesController = require("../controllers/categoriesController");
const JWTAuthenticate = require("../middlewares/JWTAuthenticate");

router.use(JWTAuthenticate);

router.route("/")
    .get(categoriesController.getCategories) //Get all
    .post(categoriesController.createCategory); //Create cate

module.exports = router