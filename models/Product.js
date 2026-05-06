const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    details: {
        type: Schema.Types.ObjectId,
        ref: 'Product_Detail',
        required: true
    },
    expiration_date: {
        type: Schema.Types.Date
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    }
})

module.exports = mongoose.model('Product', productSchema)