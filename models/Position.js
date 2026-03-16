const mongoose = require('mongoose')
const Schema = mongoose.Schema

const positionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    //An array for all of the employees holding a position
    employees: [{
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    }]
})

module.exports = mongoose.model('Position', positionSchema)