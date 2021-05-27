const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const Product = require('./models/products');
const Farm = require('./models/farm');


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


// FARM ROUTES

app.get('/farms', async (req, res) => {
    const findFarm = await Farm.find({});
    res.render('farms/index', { findFarm });
})

app.get('/farms/new', (req, res) => {
    res.render('farms/new')
})

app.post('/farms', async (req, res) => {
    const newFarm = new Farm(req.body);
    await newFarm.save();
    res.redirect(`/farms/${newFarm._id}`);
})

app.get('/farms/:id', async (req, res) => {
    const { id } = req.params;
    const foundFarm = await Farm.findById(id);
    Farm.findById(id)
        .populate('products')
        .then(form => res.render('farms/info', { foundFarm, form }))
})

app.get('/farms/:id/products/new', (req, res) => {
    const { id } = req.params;
    res.render('products/new', { categories, id });
})

app.post('/farms/:id/products', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    const { name, price, category } = req.body;
    const product = new Product({ name, price, category });
    farm.products.push(product);
    product.farm = farm;
    await farm.save();
    await product.save();
    res.redirect(`/farms/${id}`);
})

app.get('/farms/:id/edit', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    res.render('farms/edit', { farm });
})

app.put('/farms/:id', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/farms/${id}`);
})

app.get('/farms/:id/delete', async (req, res) => {
    const { id } = req.params;
    await Farm.findByIdAndDelete(id);
    res.redirect('/farms');
})

// PRODUCT ROUTES

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
    Product.findById(id)
        .populate('farm')
        .then(form => res.render('products/info', { foundProd, form }))
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
    const prod = await Product.findByIdAndDelete(id);
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
