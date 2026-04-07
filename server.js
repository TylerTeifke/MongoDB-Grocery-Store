require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const corsOptions = require('./config/corsOptions')
const cors = require('cors')
const Employee = require('./models/Employee')
const Position = require('./models/Position')
const Customer = require('./models/Customer')
const Product = require('./models/Product')
const Product_Detail = require('./models/Product_Detail')
const Product_Type = require('./models/Product_Type')
//const readline = require("readline");
//const search = require('./search_menu')
const main_menu = require('./main_menu')
//forces the Windos DNS server to resolve
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const PORT = process.env.PORT || 3500

//connect to MongoDB
connectDB()

//CORS stands for 'Cross Origin Resource Sharing'
app.use(cors(corsOptions))

//built-in middleware to handle urlencoded data
//in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
//app.use is used to apply middleware to all routes
app.use(express.urlencoded({ extended: false }))

//built-in middleware for json
app.use(express.json())

//will route any request to customers to the router
app.use('/customers', require('./routes/api/customers'))

//will route any request to employees to the router
app.use('/employees', require('./routes/api/employees'))

//will route any request to products to the router
app.use('/products', require('./routes/api/products'))

const handleFind = async (fName, lName) => {
    const query = Employee.findOne({ 'firstname': fName, 'lastname': lName })
    //query.select('firstname')
    const pos = await query.exec()
    console.log(pos)
}

const findCustomer = async (fName, lName) => {
    const query = Customer.findOne({ 'firstname': fName, 'lastname': lName })
    //query.select('firstname')
    const pos = await query.exec()
    console.log(pos)
}

//updates the variables of various tables
const handleUpdate = async (fName, lName) => {
    //Get an employee and push their ID into the employees array in a position
    const query = Product_Detail.findOne({ 'name': 'Milk' })
    const pro = await query.exec()
    await Customer.updateOne({firstname: fName, lastname: lName}, {$push:{products:{$each:[pro.products[0]]}}})
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

//creates a new customer
const addNewCustomer = async (fName, lName, empFName, empLName) => {
    const query = Employee.findOne({ 'firstname': empFName, 'lastname': empLName })
    query.select('_id')
    const emp = await query.exec()

    const newCustomer = new Customer({
        firstname: fName,
        lastname: lName,
        employee: emp._id
    })

    await newCustomer.save()

    //updates the customers array in the corresponding employee table
    await Employee.updateOne({_id: emp._id}, {$push:{customers:{$each:[newCustomer._id]}}})
}

//creates a new product type
const addNewType = async (name) => {
    const newType = new Product_Type({
        type: name
    })

    await newType.save()
}

//creates a new product
const addNewDetail = async (name, price, typeName) => {
    const query = Product_Type.findOne({ 'type': typeName })
    query.select('_id')
    const type = await query.exec()

    const newDetails = new Product_Detail({
        name: name,
        price: price,
        type: type._id
    })

    await newDetails.save()

    //updates the details array in the corresponding type table
    await Product_Type.updateOne({_id: type._id}, {$push:{details:{$each:[newDetails._id]}}})
}

//creates a copy of a product in the inventory
const addNewProduct = async (date, detailsName) => {
    const query = Product_Detail.findOne({ 'name': detailsName })
    query.select('_id')
    const details = await query.exec()

    const newPro = new Product({
        details: details._id,
        expiration_date: date
    })

    await newPro.save()

    //updates the products array in the corresponding details table
    await Product_Detail.updateOne({_id: details._id}, {$push:{products:{$each:[newPro._id]}}})
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

const getProducts = async () => {
    const query = Product.find().populate('details')
    const pros = await query.exec()
    //await pros.populate('details')
    console.log(pros[0].details.name)
    console.log(pros[0].details.price)
    console.log(pros[0].expiration_date)
}

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

    //Add new entries to a table
    /*
    const newPos1 = new Position({ name: 'Cashier' })
    const newPos2 = new Position({ name: 'Clerk' })
    const newPos3 = new Position({ name: 'Manager' })
    newPos1.save()
    newPos2.save()
    newPos3.save()
    */

    //addNewCustomer('Abraham', 'Lincoln', 'John', 'Smith')
    //addNewType('Dairy')
    //addNewDetail('Milk', 5, 'Dairy')
    //addNewProduct('2026-9-9', 'Milk')
})