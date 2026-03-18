const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productDetailsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    type: {
        type: Schema.Types.ObjectId,
        ref: 'Product_Type',
        required: true
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
})

module.exports = mongoose.model('Product_Detail', productDetailsSchema)