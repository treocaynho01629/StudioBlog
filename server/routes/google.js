const router = require("express").Router();
const googleController = require("../controllers/googleController");

router.get("/videos", googleController.getVideos); //Get videos
router.get("/reviews", googleController.getReviews); //Get reviews

module.exports = router