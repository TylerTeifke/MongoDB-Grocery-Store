const mongoose = require('mongoose')
const Schema = mongoose.Schema

const typeSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    details: [{
        type: Schema.Types.ObjectId,
        ref: 'Product_Detail'
    }]
})

module.exports = mongoose.model('Product_Type', typeSchema)