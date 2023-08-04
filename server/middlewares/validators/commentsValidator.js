const { check, validationResult } = require("express-validator");
const Comment = require("../../models/Comment");

exports.validateComment = [
    check('fullName')
        .not()
        .isEmpty()
        .withMessage("Không được bỏ trống Họ và tên!")
        .isLength({ min: 10, max: 200 })
        .withMessage("Họ và tên phải từ 10-200 kí tự"),
    check('email')
        .not()
        .isEmpty()
        .withMessage("Không được bỏ trống email!")
        .isEmail()
        .withMessage("Sai định dạng email!"),
    check('content')
        .not()
        .isEmpty()
        .withMessage("Không được bỏ trống nội dung!")
        .isLength({ min: 50})
        .withMessage("Nội dung phải từ 50 kí tự trở lên"),
    async (req, res, next) => {
        //Return validator results
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

        //Other validation
        const { email } = req.body;
    
        //Check if comment by this user existed
        const comment = await Comment.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec();
        if (comment) return res.status(409).json({ message: "Comment with this Email already existed!"});
    
        next();
    },
];