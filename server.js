require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const Employee = require('./models/Employee')
const Position = require('./models/Position')
//forces the Windos DNS server to resolve
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

//connect to MongoDB
connectDB()

const handleFind = async () => {
    const query = Employee.findOne({ 'firstname': 'Jane' })
    query.select('position_id')
    const pos = await query.exec()
    console.log(pos)
}

//updates the variables of various tables
const handleUpdate = async () => {
    const query = Position.findOne({ 'name': 'Cashier' })
    query.select('_id')
    const pos = await query.exec()

    await Employee.updateOne({ position_id: pos })
}

//Joins the employees and positions tables
const aggregateEmployeesAndPositions = async () => {
    //fix problem with the lookup aggregation
    /*
    Employee.aggregate().lookup({
        from: 'positions',
        localField: 'position_id',
        foreignField: '_id',
        as: 'position'
    }).exec()
    */
   var query = Employee.find({ firstname: 'Jane' })
   const res = await query.exec()
   console.log(res)
}

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')

    //Continue working on connecting the Employee and Position tables
    
    //Add new entries to a table
    /*
    const newPos1 = new Position({ name: 'Cashier' })
    const newPos2 = new Position({ name: 'Clerk' })
    const newPos3 = new Position({ name: 'Manager' })
    newPos1.save()
    newPos2.save()
    newPos3.save()
    */
    //handleUpdate()
    //handleFind()
    //aggregateEmployeesAndPositions()
})