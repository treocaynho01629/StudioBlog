const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//Register
router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const encryptPass = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: encryptPass,
            fullName: req.body.fullName
        });

        const user = await newUser.save();
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json(err);
    }
})

//Login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username}) //Find by username
        !user && res.status(400).json("Invalid Credential!");

        const passValid = await bcrypt.compare(req.body.password, user.password);
        !passValid && res.status(400).json("Invalid Credential!");

        const { password, ...others } = user._doc; //orbit
        res.status(200).json(others);
    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router