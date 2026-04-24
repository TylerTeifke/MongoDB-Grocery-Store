//Routes any request for employees to this file
const express = require('express')
const router = express.Router()
const employeeController = require('../../controllers/employeeController')

router.route('/')
    .get(employeeController.getAllEmployees)
    .post(employeeController.createEmployee)

router.route('/:first/:last')
    .get(employeeController.getOneEmployee)

router.route('/updateName')
    .put(employeeController.updateEmployeeName)

module.exports = router