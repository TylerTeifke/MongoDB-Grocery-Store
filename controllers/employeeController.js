//Will hold the logic of various api calls relating to employees
const Employee = require('../models/Employee')
const Position = require('../models/Position')
const Customer = require('../models/Customer')

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
    let {firstName, lastName, register, position, salary} = req.body

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

    //Will make it so the register is null for non-cashiers
    if(position !== "Cashier"){
        register = null
    }
    //Will make sure the register is capitalized in the database
    else{
        register = register.toUpperCase()
    }

    try{
        //create and save the new employee
        const newEmployee = new Employee({
            firstname: firstName,
            lastname: lastName,
            register: register,
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

const updateEmployeeName = async (req, res) => {
    const { oldFirstName, oldLastName, newFirstName, newLastName } = req.body

    //If there is no employee with the old name, send an error message to the front end
    const employee = await Employee.findOne({ firstname: oldFirstName, lastname: oldLastName }).exec()
    if(!employee){
        return res.sendStatus(409)
    }

    //If the new name is taken, send an error message
    const duplicate = await Employee.findOne({ firstname: newFirstName, lastname: newLastName }).exec()
    if(duplicate){
        return res.sendStatus(410)
    }

    try{
        await Employee.updateOne({firstname: oldFirstName, lastname: oldLastName}, {firstname: newFirstName, lastname: newLastName})
        res.status(201).json({ 'success': `employee name updated` })
    }
    catch{
        res.status(500).json({ 'message': err.message })
    }
}

const updateEmployeeSalary = async (req, res) => {
    const { firstName, lastName, salary } = req.body

    //If there is no employee with the specified name, send an error message to the front end
    const employee = await Employee.findOne({ firstname: firstName, lastname: lastName }).exec()
    if(!employee){
        return res.sendStatus(409)
    }

    try{
        await Employee.updateOne({firstname: firstName, lastname: lastName}, {salary: salary})
        res.status(201).json({ 'success': `employee salary updated` })
    }
    catch{
        res.status(500).json({ 'message': err.message })
    }
}

const updateEmployeeRegister = async (req, res) => {
    const { firstName, lastName, register } = req.body

    //If there is no employee with the specified name, send an error message to the front end
    const employee = await Employee.findOne({ firstname: firstName, lastname: lastName }).exec()
    if(!employee){
        return res.sendStatus(409)
    }
    //If the employee is not a cashier, then you cannot update their cash register
    if(employee.register === null){
        return res.sendStatus(410)
    }

    try{
        await Employee.updateOne({firstname: firstName, lastname: lastName}, {register: register.toUpperCase()})
        res.status(201).json({ 'success': `employee register updated` })
    }
    catch{
        res.status(500).json({ 'message': err.message })
    }
}

//TODO: Update customers array when switching an employee away from cashier
const updateEmployeePosition = async (req, res) => {
    let { firstName, lastName, position, register } = req.body

    //If there is no employee with the specified name, send an error message to the front end
    const employee = await Employee.findOne({ firstname: firstName, lastname: lastName }).exec()
    if(!employee){
        return res.sendStatus(409)
    }
    //Will be used to update the employees array in the old position entry
    const old_pos = await Position.findOne({ '_id': employee.position_id }).exec()
    //Will be used to find the matching position ID for the employee's new position
    const new_pos = await Position.findOne({ 'name': position }).exec()

    //Converting a cashier to another position will mean they no longer have a cash register
    if(position !== "Cashier"){
        register = null
    }
    else{
        register = register.toUpperCase()
    }

    try{

        //Empty the employee's customer array, and disconnect the customers from the employee
        //when changing them from a cashier to another position
        if(old_pos.name === "Cashier"){
            for(let i = 0; i < employee.customers.length; i++){
                await Customer.updateOne({_id: employee.customers[i]}, {employee: null})
            }

            await Employee.updateOne({firstname: firstName, lastname: lastName}, {$set:{customers: []}})
        }
        await Position.updateOne({name: old_pos.name}, {$pull:{employees: employee._id}})
        await Employee.updateOne({firstname: firstName, lastname: lastName}, {position_id: new_pos._id, register: register})
        await Position.updateOne({name: new_pos.name}, {$push:{employees:{$each:[employee._id]}}})
        res.status(201).json({ 'success': `employee position updated` })
    }
    catch(err){
        res.status(500).json({ 'message': err.message })
    }
}

module.exports = {
    getAllEmployees,
    getOneEmployee,
    createEmployee,
    updateEmployeeName,
    updateEmployeeSalary,
    updateEmployeeRegister,
    updateEmployeePosition
}