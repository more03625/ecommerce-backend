const router = require("express").Router()
const Order = require("../models/Order");
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("./verifyToken");

//CREATE Order

router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        if (!savedOrder) {
            res.status(200).json({
                error: true,
                title: "Unable to add this Order to order!",
                data: []
            })
        } else {
            res.status(200).json({
                error: false,
                title: "Order has been placed successfully!",
                data: savedOrder
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
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });

        if (!updatedOrder) {
            res.status(200).json({
                error: true,
                data: [],
                title: "Unable to update this Order"
            })
        } else {
            res.status(200).json({
                error: false,
                data: updatedOrder,
                title: "Order has been updated successfully!"
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
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const deleteOrder = await Order.findByIdAndDelete(req.params.id)
        if (!deleteOrder) {
            res.status(200).json({
                error: true,
                title: "Unable to delete this order!"
            })
        } else {
            res.status(200).json({
                error: false,
                title: "Order has been deleted successfully!"
            })
        }
    } catch (err) {
        res.status(500).json({
            error: true,
            title: err
        })
    }
});

// //GET user orders
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({
            userId: req.params.userId
        });
        if (!orders) {
            res.status(200).json({
                title: "No orders found",
                error: true,
                data: []
            })
        } else {
            res.status(200).json({
                title: "orders has been fetched successfully!",
                error: false,
                data: orders
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
        const orders = await Order.find();
        if (!orders) {
            res.status(200).json({
                title: "No order found",
                error: true,
                data: []
            })
        } else {
            res.status(200).json({
                title: "order fetched successfully",
                error: false,
                data: orders
            })
        }
    } catch (err) {
        res.status(500).json({
            title: err,
            error: true,
        })
    }
});

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                },

            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ])
        if (!income) {
            res.status(200).json({
                title: "No income found",
                error: true,
                data: []
            })
        } else {
            res.status(200).json({
                title: "Income fetched successfully",
                error: false,
                data: income
            })
        }
    } catch (err) {
        res.status(200).json({
            title: "Somethinng went wrong!",
            error: false,
            data: err
        })

    }
})
module.exports = router