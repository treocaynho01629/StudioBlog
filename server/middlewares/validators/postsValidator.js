const { check, validationResult } = require("express-validator");
const Post = require("../../models/Post");

exports.validatePost = [
    check('title')
        .not()
        .isEmpty()
        .withMessage("Không được bỏ trống tiêu đề!")
        .isLength({ min: 20, max: 200 })
        .withMessage("Tiêu đề phải từ 20-200 kí tự"),
    check('description')
        .not()
        .isEmpty()
        .withMessage("Không được bỏ trống mô tả!")
        .isLength({ min: 30, max: 500 })
        .withMessage("Mô tả phải từ 30-500 kí tự"),
    check('markdown')
        .not()
        .isEmpty()
        .withMessage("Không được bỏ trống nội dung!")
        .isLength({ min: 100, max: 1000 })
        .withMessage("Nội dung phải từ 100-1000 kí tự"),
    check('category')
        .not()
        .isEmpty()
        .withMessage("Không được bỏ trống danh mục!"),
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
    },
];