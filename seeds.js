const mongoose = require('mongoose');

const Product = require('./models/products')


mongoose.connect('mongodb://localhost:27017/farmSell', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connection to Mongoose successful!");
    })
    .catch(e => {
        console.log("Error connecting to Mongoose!")
        console.log(e);
    })


const seedProducts = [
    {
        name: 'Chicken Full',
        price: 190,
        category: 'meat'
    },
    {
        name: 'Onions',
        price: 20,
        category: 'vegetable'
    },
    {
        name: 'Mango',
        price: 100,
        category: 'fruit'
    },
    {
        name: 'Full Cream Milk',
        price: 54,
        category: 'dairy'
    },
    {
        name: 'Pumpkin',
        price: 40,
        category: 'vegetable'
    },
]

Product.insertMany(seedProducts);