//Will hold the logic of various api calls relating to customers
const Customer = require('../models/Customer')

const getAllCustomers = async (req, res) => {
    const customers = await Customer.find()
    if(!customers) return res.status(204).json({ 'message': 'No customers found.' })
    res.json(customers)
}

const getOneCustomer = async (req, res) => {
    const customer = await Customer.findOne({ firstname: req.params.first, lastname: req.params.last }).exec()
    if (!customer) {
        return res.status(409)
    }
    res.json(customer);
}

module.exports = {
    getAllCustomers,
    getOneCustomer
}