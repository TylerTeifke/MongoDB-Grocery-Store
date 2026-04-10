//Will hold the logic of various api calls relating to employees
const Employee = require('../models/Employee')

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find()
    if(!employees) return res.status(204).json({ 'message': 'No employees found.' })
    res.json(employees)
}

const getOneEmployee = async (req, res) => {
    //Will find the specified employee, and will populate their position ID and customers collections
    //with the appropriate data
    const employee = await Employee.findOne({ firstname: req.params.first, lastname: req.params.last })
                                   .populate('position_id')
                                   .populate('customers')

    if (!employee) {
        return res.sendStatus(401)
    }
    res.json(employee);
}

module.exports = {
    getAllEmployees,
    getOneEmployee
}