const mongoose = require('mongoose');

const prodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        lowercase: true,
        enum: ['fruit', 'vegetable', 'dairy', 'meat']
    }
});

const Product = new mongoose.model('Product', prodSchema);

module.exports = Product;