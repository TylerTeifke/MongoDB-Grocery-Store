const mongoose = require('mongoose')
const Schema = mongoose.Schema

const employeeSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    register: {
        type: String
    },
    position_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Position'
    },
    salary: {
        type: Number,
        required: true
    }
})

//Mongoose will set the model name to all lowercase and plural by default
module.exports = mongoose.model('Employee', employeeSchema)