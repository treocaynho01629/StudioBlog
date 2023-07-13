const router = require("express").Router();
const Category = require("../models/Category");

//Get all
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch(err) {
        res.status(500).json(err);
    }
});

//Create cate
router.post("/", async (req, res) => {
    const newCate = new Category(req.body);
    try {
        const cate = await newCate.save();
        res.status(200).json(cate);
    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router