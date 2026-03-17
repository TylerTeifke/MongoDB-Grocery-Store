require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const Employee = require('./models/Employee')
const Position = require('./models/Position')
//forces the Windos DNS server to resolve
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

//connect to MongoDB
connectDB()

const handleFind = async (fName, lName) => {
    const query = Employee.findOne({ 'firstname': fName, 'lastname': lName })
    //query.select('firstname')
    const pos = await query.exec()
    console.log(pos)
}

//updates the variables of various tables
const handleUpdate = async (position, fName, lName) => {
    //Get an employee and push their ID into the employees array in a position
    const query = Employee.findOne({ 'firstname': fName, 'lastname': lName })
    const emp = await query.exec()
    await Position.updateOne({name: position}, {$push:{employees:{$each:[emp._id]}}})
}

//Joins the employees and positions tables
const aggregateEmployeesAndPositions = async () => {
   const emp = await Employee.findOne({ firstname: 'John' }).populate('position_id').exec()
   console.log(emp)
}

//Creates a new employee
const addNewEmployee = async (position, fName, lName, reg, sal) => {
    const query = Position.findOne({ 'name': position })
    query.select('_id')
    const pos = await query.exec()

    const newEmp = new Employee({
        firstname: fName,
        lastname: lName,
        register: reg,
        position_id: pos._id,
        salary: sal
    })

    await newEmp.save()
}

const getAllEmployeesInAPosition = async (position) => {
    //const pos = await Position.findOne({'firstname': position}).exec()
    //console.log(pos)

    const query = Position.findOne({ 'name': position })
    //query.select('firstname')
    const pos = await query.exec()

    await pos.populate('employees')
    console.log(pos.employees[0].firstname)
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
    //addNewEmployee('Cashier', 'George', 'Washington', 'B', 20)
    //addNewEmployee('Cashier', 'John', 'Adams', 'C', 20)
    //addNewEmployee('Cashier', 'Thomas', 'Jefferson', 'D', 20)
    //addNewEmployee('Manager', 'James', 'Madison', null, 40)
    //handleUpdate('Clerk', 'Jane', 'Smith')
    //handleUpdate('Manager', 'James', 'Madison')
    getAllEmployeesInAPosition('Clerk')
    getAllEmployeesInAPosition('Manager')
    
    //aggregateEmployeesAndPositions()
})