//Routes any request for customers to this file
const express = require('express')
const router = express.Router()
const customerController = require('../../controllers/customerController')

router.route('/')
    .get(customerController.getAllCustomers)

router.route('/:first/:last')
    .get(customerController.getOneCustomer)

module.exports = router