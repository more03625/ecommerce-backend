const router = require("express").Router()
const Cart = require("../models/Cart");
const { verifyTokenAndAdmin, verifyToken, verifyTokenAndAuthorization } = require("./verifyToken");

//CREATE

router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const savedCart = await newCart.save();
        if (!savedCart) {
            res.status(200).json({
                error: true,
                title: "Unable to add this product to cart!",
                data: []
            })
        } else {
            res.status(200).json({
                error: false,
                title: "Item has been added to cart",
                data: savedCart
            })
        }
    } catch (err) {
        res.status(500).json({
            error: true,
            title: err,
        })
    }
});

// Update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });

        if (!updatedCart) {
            res.status(200).json({
                error: true,
                data: [],
                title: "Unable to update this Cart"
            })
        } else {
            res.status(200).json({
                error: false,
                data: updatedCart,
                title: "Cart has been updated successfully!"
            })
        }
    } catch (err) {
        res.status(500).json({
            error: true,
            title: err
        })
    }
});

// DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const deleteCart = await Cart.findByIdAndDelete(req.params.id)
        if (!deleteCart) {
            res.status(200).json({
                error: true,
                title: "Unable to delete this cart!"
            })
        } else {
            res.status(200).json({
                error: false,
                title: "Cart has been deleted successfully!"
            })
        }
    } catch (err) {
        res.status(500).json({
            error: true,
            title: err
        })
    }
});

// //GET user cart by userid
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({
            userId: req.params.userId
        });
        if (!cart) {
            res.status(200).json({
                title: "No cart found",
                error: true,
                data: []
            })
        } else {
            res.status(200).json({
                title: "cart has been fetched successfully!",
                error: false,
                data: cart
            })
        }
    } catch (err) {
        res.status(500).json({
            error: true,
            title: err
        })
    }
});

//  GET aLL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const cart = await Cart.find();
        if (!cart) {
            res.status(200).json({
                title: "No cart found",
                error: true,
                data: []
            })
        } else {
            res.status(200).json({
                title: "Cart fetched successfully",
                error: false,
                data: cart
            })
        }
    } catch (err) {
        res.status(500).json({
            title: err,
            error: true,
        })
    }
})
module.exports = router