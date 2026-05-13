//Will hold the logic of various api calls relating to product details
const Product = require('../models/Product_Detail')
const Product_Type = require('../models/Product_Type')

const createProduct = async (req, res) => {
    const { name, type, price } = req.body

    //check for duplicate products in the db
    //This line needs the .exec() because it uses the await word
    const duplicate = await Product.findOne({ name: name }).exec()
    if(duplicate) {
        return res.sendStatus(409)
    }

    const proType = await Product_Type.findOne({ type: type }).exec()

    try{
        const newProduct = new Product({
            name: name,
            price: price,
            type: proType._id
        })
    
        await newProduct.save()
    
        //updates the details array in the corresponding type table
        await Product_Type.updateOne({_id: proType._id}, {$push:{details:{$each:[newProduct._id]}}})

        res.status(201).json({ 'success': `new product ${name} created` })
    }
    catch(err){
        res.status(500).json({ 'message': err.message })
    }
}

const updatePrice = async (req, res) => {
    const { product, price } = req.body

    try{
        await Product.updateOne({name: product}, {price: price})
        res.status(201).json({ 'success': `product price updated` })
    }
    catch(err){
        res.status(500).json({ 'message': err.message })
    }
}

const getAllProducts = async (req, res) => {
    const products = await Product.find()
    if(!products) return res.status(204).json({ 'message': 'No products found.' })
    res.json(products)
}

const updateName = async (req, res) => {
    const { oldName, newName } = req.body

    //If there is no product with the old name, send an error message to the front end
    const product = await Product.findOne({ name: oldName }).exec()
    if(!product){
        return res.sendStatus(409)
    }
    
    //If the new name is taken, send an error message
    const duplicate = await Product.findOne({ name: newName }).exec()
    if(duplicate){
        return res.sendStatus(410)
    }

    try{
        await Product.updateOne({name: oldName}, {name: newName})
        res.status(201).json({ 'success': `product name updated` })
    }
    catch(err){
        res.status(500).json({ 'message': err.message })
    }
}

module.exports = {
    createProduct,
    updatePrice,
    getAllProducts,
    updateName
}