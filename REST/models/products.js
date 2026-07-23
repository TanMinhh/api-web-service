const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: [true, "Price must be provided"],
    },
    currency: {
        type: String,
        default: "VND",
    },
    company: {
        type: String,
        enum: {
            values: ["Bach Hoa Xanh", "Tap Hoa Dau Duong", "Coop Extra"],
            message: `{VALUE} is not supported!`,
        }
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Product", productSchema);