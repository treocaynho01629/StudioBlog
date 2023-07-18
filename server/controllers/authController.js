const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

//Generate access token
function generateAccessToken(user) {
    return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.SECRET_KEY, {expiresIn: '15m'});
}

//Generate refresh token
function generateRefreshToken(user) {
    return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.SECRET_REFRESH_KEY);
}

//Register
const register = async (req, res) => {
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
}

//Login
const login = async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username}) //Find by username
        if (!user) return res.status(400).json("Invalid Credential!");

        const passValid = await bcrypt.compare(req.body.password, user.password); //Check password
        if (!passValid) return res.status(400).json("Invalid Credential!");
        
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        refreshTokens.push(refreshToken);

        res.status(200).json({
            username: user.username,
            isAdmin: user.isAdmin,
            fullName: user.fullName,
            accessToken,
            refreshToken
        });
    } catch(err) {
        res.status(500).json(err);
    }
}

//Refresh access token
const refresh = (req, res) => {
    const refreshToken = req.body.token;
    if(!refreshToken) return res.status(401).json("Not authenticated!")
    if(!refreshTokens.includes(refreshToken)) return res.status(403).json("Invalid refresh token!");
    
    jwt.verify(refreshToken, process.env.SECRET_REFRESH_KEY, (err, user) => {
        if (err) return res.status(403).json(err);
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        refreshTokens.push(newRefreshToken);

        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })
    })
}

//Lougout
const logout = (req, res) => {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    res.status(200).json("Logged out");
}

module.exports = {
    register,
    login,
    refresh,
    logout
}