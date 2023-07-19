const router = require("express").Router();
const uploadController = require("../controllers/uploadController");

router.post("/upload", uploadController.uploadImage, (req, res) => {
    return res.status(200).json({ message: "Image uploaded" })
})
router.post("/upload-multiple", uploadController.uploadImages, (req, res) => {
    return res.status(200).json({ message: "Images uploaded" })
})
router.get("/", uploadController.getListImages)
router.get('/:name', uploadController.download)

module.exports = router;