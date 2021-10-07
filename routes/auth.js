const router = require("express").Router()
const User = require("../models/User")
const cryptoJs = require('crypto-js')
const jwt = require("jsonwebtoken")

router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: cryptoJs.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET)
    });

    try {
        const response = await newUser.save();
        res.status(201).json(response)
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            res.status(401).json({
                error: false,
                data: [],
                title: "Invalid email or password!"
            })
        } else {
            const hashedPassword = cryptoJs.AES.decrypt(user.password, process.env.PASSWORD_SECRET);
            const dbPassword = hashedPassword.toString(cryptoJs.enc.Utf8); // Bcrypt is more secure!

            if (dbPassword != req.body.password) {
                res.status(401).json({
                    error: false,
                    data: [],
                    title: "Invalid email or password!"
                })
            } else {

                const accessToken = jwt.sign({
                    id: user._id,
                    is_admin: user.is_admin
                }, process.env.JWT_SECRET, { expiresIn: "3d" });

                const { password, ...others } = user._doc; // We have deleted `password` KEY from `user` object & saved other data to new `others` object and passed it

                res.status(200).json({
                    title: "User Logged in successfully!",
                    error: false,
                    token: accessToken,
                    data: others
                })
            }
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router