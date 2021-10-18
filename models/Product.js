const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: Array,
        required: true
    },
    categories: {
        type: Array,
        required: true
    },
    original_price: {
        type: Number,
        required: true
    },
    discounted_price: {
        type: Number,
        required: true
    },
    expandable_storage: {
        type: Number,
        required: true
    },
    internal_storage: {
        type: Number,
        required: true
    },
    modal_name: {
        type: String,
        required: true
    },
    modal_number: {
        type: String,
        required: true
    },
    ram: {
        type: Number,
        required: true
    },
    primary_camera: {
        type: String,
        required: true
    },
    secondary_camera: {
        type: String,
        required: true
    },
    slot_type: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    memory_card_type: {
        type: String,
        required: true
    },
    flash : {
        type:String,
        required:true
    },
    status : {
        type:String,
        required:true
    },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);