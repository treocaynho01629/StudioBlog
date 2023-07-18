const Category = require("../models/Category");

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch(err) {
        res.status(500).json(err);
    }
}

const createCategory = async (req, res) => {
    const newCate = new Category(req.body);
    try {
        const cate = await newCate.save();
        res.status(200).json(cate);
    } catch(err) {
        res.status(500).json(err);
    }
}

module.exports = {
    getCategories,
    createCategory
}