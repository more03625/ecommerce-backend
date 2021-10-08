const route = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET)

router.post("payment", (req, res) => {
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "inr"
    }, (stripeErr, stripeRes) => {
        if (stripeErr) {
            res.status(500).json({
                title: "Something went wrong!",
                error: true,
                data: stripeErr
            })
        } else {
            res.status(200).json({
                title: "Payment has been successfully completed!",
                error: false,
                data: stripeRes
            })
        }
    })
})

module.exports = router