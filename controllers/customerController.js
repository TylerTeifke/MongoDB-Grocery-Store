//Will hold the logic of various api calls relating to customers
const Customer = require('../models/Customer')
const Employee = require('../models/Employee')

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

module.exports = {
    getAllCustomers,
    getOneCustomer,
    createCustomer
}