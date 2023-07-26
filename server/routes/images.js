const router = require("express").Router();
const uploadController = require("../controllers/uploadController");
const JWTAuthenticate = require("../middlewares/JWTAuthenticate");

router.post("/upload", JWTAuthenticate, uploadController.uploadImage, (req, res) => {
    return res.status(200).json({ message: "Image uploaded" })
})
router.post("/upload-multiple", JWTAuthenticate, uploadController.uploadImages, (req, res) => {
    return res.status(200).json({ message: "Images uploaded" })
})
router.delete("/:name", JWTAuthenticate, uploadController.deleteImage, (req, res) => {
    return res.status(200).json({ message: 'Deleted image' });
})
router.get("/", uploadController.getListImages)
router.get("/:name", uploadController.download)

module.exports = router;