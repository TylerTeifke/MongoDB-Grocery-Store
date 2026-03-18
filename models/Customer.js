const mongoose = require('mongoose')
const Schema = mongoose.Schema

const customerSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    employee: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Employee'
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
})

module.exports = mongoose.model('Customer', customerSchema)