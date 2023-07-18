const jwt = require("jsonwebtoken")

const JWTAuthenticate = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: "Unauthorized" })
    const token = authHeader.split(' ')[1] //Remove Bearer

    jwt.verify(
        token,
        process.env.SECRET_KEY,
        (err, auth) => {
            if (err) return res.status(403).json({ message: "Invalid token!" })
            req.auth = auth;
            next()
        }
    )
}

module.exports = JWTAuthenticate 