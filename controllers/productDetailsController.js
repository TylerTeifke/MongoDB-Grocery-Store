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

    //Will check to make sure the product type exists
    const proType = await Product_Type.findOne({ type: type }).exec()
    if(!proType){
        return res.sendStatus(410)
    }

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

module.exports = {
    createProduct
}