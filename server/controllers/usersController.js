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

//Update user
const updateUser = async (req, res) => {
    const { username, email, password, fullName, isAdmin } = req.body;

    //Authorization
    if (!usernamae || !email || !password || !fullName) {
        return res.status(400).json({message: "All field is required!"});
    }

    //Get original user
    const user = await User.findById(req.params.id).exec();
    if (!user) return res.status(400).json({ message: "User not found!" });

    if (req.auth.id == user._id || req.auth.isAdmin){
        if (password) {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
        }
        try {
            user.username = username;
            user.password = password;
            user.email = email;
            user.fullName = fullName;
            if (isAdmin != null && req.auth.isAdmin) user.isAdmin = isAdmin;

            const updatedUser = await user.save();
            res.status(200).json(updatedUser);
        } catch(err) {
            res.status(500).json(err);
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
        try {
            try {
                await Post.deleteMany({ user: user._id }).exec();
                await User.findByIdAndDelete(user._id).exec();
                res.status(200).json({ message: `User ${user.username} has been deleted!`});
            } catch(err) {
                res.status(500).json(err);
            }
        } catch(err) {
            res.status(404).json({ message: "User not found!" });
        }
    } else {
        res.status(404).json({ message: "Wrong user!" });
    }
}

module.exports = {
    getUser,
    updateUser,
    deleteUser
}