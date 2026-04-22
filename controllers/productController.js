//Will hold the logic of various api calls relating to products
const Product = require('../models/Product')
const Product_Type = require('../models/Product_Type')

const getAllProducts = async (req, res) => {
    const products = await Product.find().populate('details')
    if(!products) return res.status(204).json({ 'message': 'No products found.' })
    res.json(products)
}

module.exports = {
    getAllProducts
}