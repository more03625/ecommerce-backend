const router = require("express").Router()
const Product = require("../models/Product");
const { verifyTokenAndAdmin } = require("./verifyToken");

//CREATE

router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        if (!savedProduct) {
            res.status(200).json({
                error: true,
                title: "Unable to add this product!",
                data: []
            })
        } else {
            res.status(200).json({
                error: false,
                title: "Product has been added successfully!",
                data: savedProduct
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
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });

        if (!updatedProduct) {
            res.status(200).json({
                error: true,
                data: [],
                title: "Unable to update this product"
            })
        } else {
            res.status(200).json({
                error: false,
                data: updatedProduct,
                title: "Product has been updated successfully!"
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
        const deleteProduct = await Product.findByIdAndDelete(req.params.id)
        if (!deleteProduct) {
            res.status(200).json({
                error: true,
                title: "Unable to delete this product!"
            })
        } else {
            res.status(200).json({
                error: false,
                title: "Product has been deleted successfully!"
            })
        }
    } catch (err) {
        res.status(500).json({
            error: true,
            title: err
        })
    }
});

//GET Product by search query
router.get("/search/", async (req, res) => {
    try {
        // const products = await Product.find({title: {"$regex": ".*" + req.query.search + ".*"}});
        const products = await Product.find({ $text: { $search: req.query.search } });
        // Price 
        // Brand
        // Colour
        
        if (!products) {
            res.status(200).json({
                title: "No product found",
                error: true,
                data: []
            })
        } else {
            res.status(200).json({
                title: "Product has been fetched successfully!",
                error: false,
                data: products
            })
        }
    } catch (err) {
        res.status(500).json({
            error: true,
            title: err
        })
    }
});

//GET Product by ID
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(200).json({
                title: "No product found",
                error: true,
                data: []
            })
        } else {
            res.status(200).json({
                title: "Product has been fetched successfully!",
                error: false,
                data: product
            })
        }
    } catch (err) {
        res.status(500).json({
            error: true,
            title: err
        })
    }
});
//Get Product By ID
router.get("/", async (req, res) => {
    const query = req.query.new
    const category = req.query.category

    try {
        let products;
        if (query) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
        } else if (category) {
            products = await Product.find({
                categories: {
                    $in: [category]
                }
            })
        } else {
            products = await Product.find()
        }

        if (!products) {
            res.status(200).json({
                title: "No products found",
                error: true,
                data: []
            })
        } else {
            res.status(200).json({
                title: "Products has been fetched successfully",
                error: false,
                data: products
            })
        }

    } catch (err) {
        res.status(500).json({
            error: true,
            title: err
        })
    }
})

module.exports = router