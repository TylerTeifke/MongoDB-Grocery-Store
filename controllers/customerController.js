//Will hold the logic of various api calls relating to customers
const Customer = require('../models/Customer')

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

module.exports = {
    getAllCustomers,
    getOneCustomer
}