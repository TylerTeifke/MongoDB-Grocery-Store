require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const Employee = require('./models/Employee')
//forces the Windos DNS server to resolve
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

//connect to MongoDB
connectDB()

const handleFind = async () => {
    const query = Employee.findOne({ 'firstname': 'Jane' })
    query.select('firstname lastname')
    const Jane = await query.exec()
    console.log('%s %s', Jane.firstname, Jane.lastname)
}

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    handleFind()
})