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
        type: mongoose.ObjectId,
        required: true
    },
    salary: {
        type: Number,
        required: true
    }
})

//Mongoose will set the model name to all lowercase and plural by default
module.exports = mongoose.model('Employee', employeeSchema)