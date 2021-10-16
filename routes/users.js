const router = require("express").Router()
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const cryptoJs = require('crypto-js')
const User = require("../models/User")

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = cryptoJs.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET)
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        if (!updatedUser) {
            res.status(200).json({
                error: true,
                data: [],
                title: "Unable to update this user"
            })
        } else {
            res.status(200).json({
                error: false,
                data: updatedUser,
                title: "User has been updated successfully!"
            })
        }
    }
    catch (err) {
        res.status(500).json({
            error: true,
            title: err
        })
    }
})
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        if (!deleteUser) {
            res.status(200).json({
                error: true,
                title: "Unable to delete this user!"
            })
        } else {
            res.status(200).json({
                error: false,
                title: "User has been deleted successfully!"
            })
        }
    } catch (err) {
        res.status(500).json({
            error: true,
            title: "Internal server error!"
        })
    }
});
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(200).json({
                title: "No user found",
                error: true,
                data: []
            })
        } else {
            const { password, ...others } = user._doc; // deleted `password` from `user` & stored evrything into `others`
            res.status(200).json({
                title: "user fetched successfully",
                error: false,
                data: others
            })
        }
    } catch (err) {
        res.status(500).json({
            error: true,
            title: "Internal server error!"
        })
    }
});

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new

    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();

        if (!users) {
            res.status(200).json({
                title: "No user found",
                error: true,
                data: []
            })
        } else {
            res.status(200).json({
                title: "user fetched successfully",
                error: false,
                data: users
            })
        }
    } catch (err) {
        res.status(500).json({
            error: true,
            title: "Internal server error!"
        })
    }
});
// get the number registerd user this year
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" }
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                }
            }
        ]);
        if(!data){
            res.status(200).json({
                error: true,
                title: "There are no products!",
                data: []
            })  
        }else{
            res.status(200).json({
                error: false,
                title: "Stats fetched successfully!",
                data: data
            })
        }
        
    } catch (err) {
        res.status(500).json({
            error: true,
            title: "Internal server error!"
        })
    }
});
module.exports = router