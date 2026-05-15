//Will hold the logic of various api calls relating to customers
const Customer = require('../models/Customer')
const Employee = require('../models/Employee')
const Product = require('../models/Product')

const getAllCustomers = async (req, res) => {
    const customers = await Customer.find()
    if(!customers) return res.status(204).json({ 'message': 'No customers found.' })
    res.json(customers)
}

const getOneCustomer = async (req, res) => {
    //Will find the specified customer, and will populate their cashier and product collections
    //with the appropriate data
    const customer = await Customer.findOne({ firstname: req.params.first, lastname: req.params.last })
                                   .populate('employee')
                                   .populate({
                                    path: 'products',
                                    populate: {path: 'details'}
                                })

    if (!customer) {
        return res.sendStatus(401)
    }
    res.json(customer);
}

const createCustomer = async (req, res) =>  {
    const { custFirstName, custLastName, empFirstName, empLastName } = req.body

    //check for duplicate customers in the db
    //This line needs the .exec() because it uses the await word
    const duplicate = await Customer.findOne({ firstname: custFirstName, lastname: custLastName }).exec()
    if(duplicate) {
        return res.sendStatus(409)
    }

    //Will check to make sure the employee exists and is a cashier
    const emp = await Employee.findOne({ firstname: empFirstName, lastname: empLastName}).exec()
    if(!emp){
        return res.sendStatus(410)
    }
    if(emp.register === null){
        return res.sendStatus(411)
    }

    try{
        //create and save the new customer
        const newCustomer = new Customer({
            firstname: custFirstName,
            lastname: custLastName,
            employee: emp._id
        })
        
        await newCustomer.save()

        //updates the customers array in the corresponding employee table
        await Employee.updateOne({_id: emp._id}, {$push:{customers:{$each:[newCustomer._id]}}})

        res.status(201).json({ 'success': `new customer ${custFirstName} ${custLastName} created` })
    }
    catch(err){
        res.status(500).json({ 'message': err.message })
    }
}

const updateCustomerName = async (req, res) => {
    const { oldFirstName, oldLastName, newFirstName, newLastName } = req.body

    //If there is no customer with the old name, send an error message to the front end
    const customer = await Customer.findOne({ firstname: oldFirstName, lastname: oldLastName }).exec()
    if(!customer){
        return res.sendStatus(409)
    }

    //If the new name is taken, send an error message
    const duplicate = await Customer.findOne({ firstname: newFirstName, lastname: newLastName }).exec()
    if(duplicate){
        return res.sendStatus(410)
    }

    try{
        await Customer.updateOne({firstname: oldFirstName, lastname: oldLastName}, {firstname: newFirstName, lastname: newLastName})
        res.status(201).json({ 'success': `customer name updated` })
    }
    catch(err){
        res.status(500).json({ 'message': err.message })
    }
}

const updateCustomerCashier = async (req, res) => {
    const { custFirstName, custLastName, empFirstName, empLastName } = req.body

    //Will check to make sure the customer exists
    const customer = await Customer.findOne({ firstname: custFirstName, lastname: custLastName }).exec()
    if(!customer) {
        return res.sendStatus(409)
    }

    //Will check to make sure the employee exists and is a cashier
    const new_emp = await Employee.findOne({ firstname: empFirstName, lastname: empLastName}).exec()
    if(!new_emp){
        return res.sendStatus(410)
    }
    if(new_emp.register === null){
        return res.sendStatus(411)
    }
    if(customer.employee !== null && new_emp._id.toString() === customer.employee.toString()){
        return res.sendStatus(412)
    }

    try{
        //Will take the customer out of their current cashier's list, and insert them
        //into the new cashier's list
        if(customer.employee !== null){
            await Employee.updateOne({_id: customer.employee}, {$pull:{customers: customer._id}})
        }
        await Employee.updateOne({_id: new_emp._id}, {$push:{customers:{$each:[customer._id]}}})
        await Customer.updateOne({_id: customer._id}, {employee: new_emp._id})
        res.status(201).json({ 'success': `customer cashier updated` })
    }
    catch(err){
        res.status(500).json({ 'message': err.message })
    }
}

const addToCart = async (req, res) => {
    const { firstName, lastName, itemID } = req.body
    const customer = await Customer.findOne({ firstname: firstName, lastname: lastName }).exec()
    const product = await Product.findOne({ _id: itemID }).exec()

    //If the customer already has the product in their cart, then don't add it again
    if(product.customer !== null && customer._id.toString() === product.customer.toString()){
        return res.sendStatus(409)
    }

    try{
        //Updates both the customer and the product
        await Product.updateOne({_id: itemID}, {customer: customer._id})
        await Customer.updateOne({firstname: firstName, lastname: lastName}, {$push:{products:{$each:[itemID]}}})
        res.status(201).json({ 'success': `customer cart updated` })
    }
    catch(err){
        res.status(500).json({ 'message': err.message })
    }
}

const removeFromCart = async (req, res) => {
    const { firstName, lastName, itemID } = req.body
    const customer = await Customer.findOne({ firstname: firstName, lastname: lastName }).exec()
    const product = await Product.findOne({ _id: itemID }).exec()

    //If the customer does not have the product in their cart, then send an error message
    if(product.customer === null || customer._id.toString() !== product.customer.toString()){
        return res.sendStatus(409)
    }

    try{
        //Updates both the customer and the product
        await Product.updateOne({_id: itemID}, {customer: null})
        await Customer.updateOne({firstname: firstName, lastname: lastName}, {$pull:{products: itemID}})
        res.status(201).json({ 'success': `customer cart updated` })
    }
    catch(err){
        res.status(500).json({ 'message': err.message })
    }
}

const deleteCustomer = async (req, res) => {
    const { firstName, lastName } = req.body

    //If there is no customer with the specified name, send an error message to the front end
    const customer = await Customer.findOne({ firstname: firstName, lastname: lastName }).exec()
    if(!customer){
        return res.sendStatus(409)
    }

    try{
        //Will disconnect the customer from all of their products before being deleted
        for(let i = 0; i < customer.products.length; i++){
            await Product.updateOne({_id: customer.products[i]}, {customer: null})
        }

        if(customer.employee !== null){
            //disconnect the customer from their cashier before deleting them
            await Employee.updateOne({_id: customer.employee}, {$pull:{customers: customer._id}})
        }

        //deletes the specified customer
        await Customer.deleteOne({_id: customer._id})
        res.status(201).json({ 'success': `Customer ${firstName} ${lastName} deleted` })
    }
    catch(err){
        res.status(500).json({ 'message': err.message })
    }
}

module.exports = {
    getAllCustomers,
    getOneCustomer,
    createCustomer,
    updateCustomerName,
    updateCustomerCashier,
    addToCart,
    removeFromCart,
    deleteCustomer
}