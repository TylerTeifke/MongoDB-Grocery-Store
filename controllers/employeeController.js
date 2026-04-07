//Will hold the logic of various api calls relating to employees
const Employee = require('../models/Employee')

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find()
    if(!employees) return res.status(204).json({ 'message': 'No employees found.' })
    res.json(employees)
}

module.exports = {
    getAllEmployees
}