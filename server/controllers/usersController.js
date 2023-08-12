const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

//Get single user
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(400).json({ message: "User not found!" });

        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch(err) {
        res.status(500).json(err);
    }
}

//Get multiple users
const getUsers = async (req, res) => {
    try {
        const page = req.query.page ? (Number(req.query.page) - 1) : 0;
        const size = req.query.size ? Number(req.query.size) : 8;
        const startIndex = page * size;
        
        const users = await User.find().select('-password').sort({ _id: -1 }).limit(size).skip(startIndex).lean();
        const total = await User.countDocuments() || 0;

        res.status(200).json({ 
            data: users, 
            info: {
                currPage: page, 
                pageSize: size,
                totalElements: total,
                numberOfPages: Math.ceil(total / size)
            }
        });
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

//Create user
const createUser = async (req, res) => {
    const { username, email, password, fullName, isAdmin } = req.body;

    //Authorization
    if (!username || !email || !password || !fullName) {
        return res.status(400).json({message: "All field is required!"});
    }

    if (req.auth.isAdmin) {
        try {
            const salt = await bcrypt.genSalt(10);
            const encryptPass = await bcrypt.hash(password, salt);
            const newUser = new User({
                username,
                email,
                password: encryptPass,
                fullName,
                isAdmin
            });
    
            const user = await newUser.save();
            res.status(200).json(user);
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(404).json({message: "Wrong user!"});
    }
}

//Update user
const updateUser = async (req, res) => {
    const { username, email, password, fullName, isAdmin } = req.body;

    //Authorization
    if (!email || !fullName) {
        return res.status(400).json({message: "All field is required!"});
    }

    //Get original user
    const user = await User.findById(req.params.id).exec();
    if (!user) return res.status(400).json({ message: "User not found!" });

    if (req.auth.id == user._id || req.auth.isAdmin){
        if (!user.isAdmin || (user.isAdmin && req.auth.id == user._id)) { //If role admin >> update themself
            if (password) {
                const salt = await bcrypt.genSalt(10);
                const newPassword = await bcrypt.hash(password, salt);
                user.password = newPassword;
            }
            try {
                user.email = email;
                user.fullName = fullName;
                if (username != null && req.auth.isAdmin) user.username = username;
                if (isAdmin != null && req.auth.isAdmin) user.isAdmin = isAdmin;
    
                const updatedUser = await user.save();
                res.status(200).json(updatedUser);
            } catch(err) {
                res.status(500).json(err);
            }
        }
    } else {
        res.status(404).json({message: "Wrong user!"});
    }
}

const deleteUser = async (req, res) => {
    //Get original user
    const user = await User.findById(req.params.id).exec();
    if (!user) return res.status(400).json({ message: "User not found!" });

    if (req.auth.id == user._id || req.auth.isAdmin){
        if (!user.isAdmin || (user.isAdmin && req.auth.id == user._id)) { //If role admin >> delete themself
            try {
                try {
                    await Post.updateMany({ user: user._id }, {"$set": {"user": null}}).exec();
                    await User.findByIdAndDelete(user._id).exec();
                    res.status(200).json({ message: `User ${user.username} has been deleted!`});
                } catch(err) {
                    res.status(500).json(err);
                }
            } catch(err) {
                res.status(404).json({ message: "User not found!" });
            }
        }
    } else {
        res.status(404).json({ message: "Wrong user!" });
    }
}

module.exports = {
    getUser,
    getUsers,
    createUser,
    updateUser,
    deleteUser
}