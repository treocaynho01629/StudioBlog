const { check, validationResult } = require("express-validator");
const User = require("../../models/User");

const createCheck = () => [
    check('username')
        .not()
        .isEmpty()
        .withMessage("Không được bỏ trống tên đăng nhập!")
        .isLength({ min: 5, max: 30 })
        .withMessage("Tên đăng nhập phải từ 5-30 kí tự"),
    check('password')
        .not()
        .isEmpty()
        .withMessage("Không được bỏ trống mật khẩu!")
        .isLength({ min: 5, max: 50 })
        .withMessage("Mật khẩu phải từ 5-50 kí tự"),
    check('email')
        .not()
        .isEmpty()
        .withMessage("Không được bỏ trống email!")
        .isEmail()
        .withMessage("Sai định dạng email!"),
    check('fullName')
        .not()
        .isEmpty()
        .withMessage("Không được bỏ trống Họ và tên!"),
]

const createReport = async (req, res, next) => {
    //Return validator results
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    //Other validation
    const { username, email } = req.body;

    //Check if user with this username or email existed
    const duplicate = await User.findOne({$or: [
        { email },
        { username }
    ]}).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ msg: "Tên đăng nhập hoặc email đã được sử dụng!"});
    }

    next();
}

const updateCheck = () => [
    check('username')
        .not()
        .isEmpty()
        .withMessage("Không được bỏ trống tên đăng nhập!")
        .isLength({ min: 5, max: 30 })
        .withMessage("Tên đăng nhập phải từ 5-30 kí tự"),
    check('password')
        .optional()
        .isLength({ min: 5, max: 50 })
        .withMessage("Mật khẩu phải từ 5-50 kí tự"),
    check('email')
        .not()
        .isEmpty()
        .withMessage("Không được bỏ trống email!")
        .isEmail()
        .withMessage("Sai định dạng email!"),
    check('fullName')
        .not()
        .isEmpty()
        .withMessage("Không được bỏ trống Họ và tên!"),
]

const updateReport = async (req, res, next) => {
    //Return validator results
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    //Other validation
    const { username, email } = req.body;
    const { id } = req.params;
    let user;

    if (id){
        user = await User.findById(id).exec();
        if (!user) return res.status(400).json({ msg: "Không tìm thấy người dùng!"});
    }

    //Check if user with this username or email existed
    const duplicate = await User.findOne({$or: [
        { email },
        { username }
    ]}).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (duplicate && !(user && duplicate?._id.toString() === user.id)) {
        return res.status(409).json({ msg: "Tên đăng nhập hoặc email đã được sử dụng!"});
    }

    next();
}

module.exports = {
    validateUser: [
        createCheck(),
        createReport
    ],
    validateUpdateUser: [
        updateCheck(),
        updateReport
    ],
};