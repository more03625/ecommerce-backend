const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token
    if (!authHeader) {
        res.status(401).json({
            title: "You are not authorized",
            error: true
        })
    } else {
        var token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                res.status(401).json({
                    title: "Invalid token",
                    error: true
                })
            } else {
                req.user = user;
                next()
            }
        })
    }
}
const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id !== req.params.id || !req.user.is_admin) {
            res.sendStatus(403).json({
                error: true,
                title: "You are now allowed to perform this action."
            })
        } else {
            next();
        }
    })
}
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.is_admin) {
            next();
        } else {
            res.sendStatus(403).json({
                error: true,
                title: "You are now allowed to perform this action."
            })
        }
    })
}

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin }