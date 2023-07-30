const { check, validationResult } = require("express-validator");
const User = require("../../models/User");

const validateRegister = [
check('username')
    .not()
    .isEmpty()
    .withMessage("Không được bỏ trống tiêu đề!"),
check('password')
    .not()
    .isEmpty()
    .withMessage("Không được bỏ trống mô tả!"), 
async (req, res) => {
    //Return validator results
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    //Other validation
    const { title, id } = req.body;
    let post;

    //Get original post if updated
    if (id){
        post = await Post.findById(id).exec();
        if (!post) return res.status(400).json({ msg: "Không tìm thấy bài viết!"});
    }

    //Check if post existed
    const duplicate = await Post.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (duplicate && !(post && duplicate?._id.toString() === post.id)) {
        return res.status(409).json({ msg: "Bài viết với tiêu đề trên đã tồn tại"});
    }

    return res.status(200).json({ isValid: true, message: 'Post is valid'});
}]

exports = [
    
];