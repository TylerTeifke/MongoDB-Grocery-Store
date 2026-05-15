//Routes any request for customers to this file
const express = require('express')
const router = express.Router()
const customerController = require('../../controllers/customerController')

router.route('/')
    .get(customerController.getAllCustomers)
    .post(customerController.createCustomer)

router.route('/:first/:last')
    .get(customerController.getOneCustomer)

router.route('/updateName')
    .put(customerController.updateCustomerName)

router.route('/updateCashier')
    .put(customerController.updateCustomerCashier)

router.route('/addProduct')
    .put(customerController.addToCart)

router.route('/removeProduct')
    .put(customerController.removeFromCart)

router.route('/deleteEntry')
    .delete(customerController.deleteCustomer)

module.exports = router