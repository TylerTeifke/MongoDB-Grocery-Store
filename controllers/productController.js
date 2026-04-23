//Will hold the logic of various api calls relating to products
const Product = require('../models/Product')
const Product_Type = require('../models/Product_Type')
const Product_Detail = require('../models/Product_Detail')

const getAllProducts = async (req, res) => {
    const products = await Product.find().populate('details')
    if(!products) return res.status(204).json({ 'message': 'No products found.' })
    res.json(products)
}

const addToInventory = async (req, res) => {
    let { name, expiration } = req.body

    const details = await Product_Detail.findOne({ 'name': name }).exec()
    if(!details){
        return res.sendStatus(409)
    }

    const type = await Product_Type.findOne({ '_id': details.type }).exec()
    if(type.type === 'Vegetables'){
        expiration = null
    }
    
    try{
        const newPro = new Product({
            details: details._id,
            expiration_date: expiration
        })
    
        await newPro.save()
    
        //updates the products array in the corresponding details table
        await Product_Detail.updateOne({_id: details._id}, {$push:{products:{$each:[newPro._id]}}})
        res.status(201).json({ 'success': `new item added to the inventory` })
    }
    catch(err){
        res.status(500).json({ 'message': err.message })
    }
}

module.exports = {
    getAllProducts,
    addToInventory
}