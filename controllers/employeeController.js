//Will hold the logic of various api calls relating to employees
const Employee = require('../models/Employee')
const Position = require('../models/Position')

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

const createEmployee = async (req, res) => {
    const {firstName, lastName, register, position, salary} = req.body

    //check for duplicate employees in the db
    //This line needs the .exec() because it uses the await word
    const duplicate = await Employee.findOne({ firstname: firstName, lastname: lastName }).exec()
    if(duplicate) {
        return res.sendStatus(409)
    }

    //Will check to make sure the position exists
    const pos = await Position.findOne({ name: position }).exec()
    if(!pos){
        return res.sendStatus(410)
    }

    try{
        //create and save the new employee
        const newEmployee = new Employee({
            firstname: firstName,
            lastname: lastName,
            register: register.toUpperCase(),
            position_id: pos._id,
            salary: salary
        })
            
        await newEmployee.save()
    
        //updates the employees array in the corresponding position table
        await Position.updateOne({_id: pos._id}, {$push:{employees:{$each:[newEmployee._id]}}})
    
        res.status(201).json({ 'success': `new employee ${firstName} ${lastName} created` })
    }
    catch(err){
        res.status(500).json({ 'message': err.message })
    }
}

module.exports = {
    getAllEmployees,
    getOneEmployee,
    createEmployee
}