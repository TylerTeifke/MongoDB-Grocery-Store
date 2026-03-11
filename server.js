require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
//forces the Windos DNS server to resolve
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

//connect to MongoDB
connectDB()

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
})