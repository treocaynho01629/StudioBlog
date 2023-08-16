const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Generate access token
function generateAccessToken(user) {
    return jwt.sign({ id: user._id, username: user.username, isAdmin: user.isAdmin }, process.env.SECRET_KEY, {expiresIn: '15m'});
}

//Generate refresh token
function generateRefreshToken(user) {
    return jwt.sign({ id: user._id, username: user.username, isAdmin: user.isAdmin }, process.env.SECRET_REFRESH_KEY, {expiresIn: '30d'});
}

//Register
const register = async (req, res) => {
    const { username, email, password, fullName } = req.body;

    //Authorization
    if (!username || !email || !password || !fullName) {
        return res.status(400).json({message: "All field is required!"});
    }

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
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ message: "Username and password are required!" });

    try {
        const user = await User.findOne({username: req.body.username}) //Find by username
        if (!user) return res.status(401).json("Invalid Credential!");

        const passValid = await bcrypt.compare(req.body.password, user.password); //Check password
        if (!passValid) return res.status(401).json("Invalid Credential!");
        
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        //Store refresh token in cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 30 * 25 * 60 * 60 * 1000
        })

        res.status(200).json({
            username: user.username,
            accessToken
        });
    } catch(err) {
        res.status(500).json(err);
    }
}

//Refresh access token
const refresh = (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.refreshToken) return res.status(401).json("Unauthorized!"); //Check if exist

    //Validate refresh token
    const refreshToken = cookies.refreshToken;
    jwt.verify(refreshToken, 
        process.env.SECRET_REFRESH_KEY, 
        async (err, auth) => {
        if (err) return res.status(403).json({ message: "Forbiden!", err});

        //Find token's user
        const user = await User.findById(auth.id);
        if (!user) return res.status(401).json({ message: "Invalid Credential!" });

        const newAccessToken = generateAccessToken(user);

        res.status(200).json({
            accessToken: newAccessToken,
        })}
    )
}

//Lougout
const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(204);

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    })
    res.status(200).json({ message: "Logged out" });
}

module.exports = {
    register,
    login,
    refresh,
    logout
}