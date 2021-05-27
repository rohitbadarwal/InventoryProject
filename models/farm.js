const mongoose = require('mongoose');
const Product = require('./products');

const { Schema } = mongoose;

const farmSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Farm name cannot be empty']
    },
    city: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, 'Email required']
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
});

farmSchema.post('findOneAndDelete', async function (farm) {
    if (farm.products.length) {
        await Product.deleteMany({ _id: { $in: farm.products } })
    }
})

const Farm = new mongoose.model('Farm', farmSchema);

module.exports = Farm;