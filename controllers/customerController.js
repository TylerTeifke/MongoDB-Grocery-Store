//Will hold the logic of various api calls relating to customers
const Customer = require('../models/Customer')

const getAllCustomers = async (req, res) => {
    const customers = await Customer.find()
    if(!customers) return res.status(204).json({ 'message': 'No customers found.' })
    res.json(customers)
}

module.exports = {
    getAllCustomers
}