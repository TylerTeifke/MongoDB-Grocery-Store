//Routes any request for products to this file
const express = require('express')
const router = express.Router()
const productController = require('../../controllers/productController')
const productDetailsController = require('../../controllers/productDetailsController')

router.route('/')
    .get(productController.getAllProducts)
    .post(productDetailsController.createProduct)


module.exports = router