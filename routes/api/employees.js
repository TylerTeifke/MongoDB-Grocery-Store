//Routes any request for employees to this file
const express = require('express')
const router = express.Router()
const employeeController = require('../../controllers/employeeController')

router.route('/')
    .get(employeeController.getAllEmployees)

module.exports = router