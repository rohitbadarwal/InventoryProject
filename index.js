const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const Product = require('./models/products')


mongoose.connect('mongodb://localhost:27017/farmSell', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connection to Mongoose successful!");
    })
    .catch(e => {
        console.log("Error connecting to Mongoose!")
        console.log(e);
    })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
mongoose.set('useFindAndModify', false);

const categories = ['fruit', 'vegetable', 'dairy', 'meat'];

app.get('/', (req, res) => {
    res.render('products/home');
})

app.get('/products', async (req, res) => {
    const products = await Product.find({});
    res.render('products/index', { products });
})

app.get('/products/new', (req, res) => {
    res.render('products/new');
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const foundProd = await Product.findById(id);
    res.render('products/info', { foundProd });
})

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
})

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories });
})

app.get('/products/:id/delete', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const prod = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/products/${prod._id}`);
})


app.listen(8080, () => {
    console.log("Listening on Port 8080");
})
