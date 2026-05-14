//Routes any request for products to this file
const express = require('express')
const router = express.Router()
const productController = require('../../controllers/productController')
const productDetailsController = require('../../controllers/productDetailsController')

router.route('/')
    .get(productController.getAllProducts)
    .post(productDetailsController.createProduct)

router.route('/inventory')
    .post(productController.addToInventory)

router.route('/available')
    .get(productController.getAllProductsAvailable)

router.route('/purchased/:first/:last')
    .get(productController.getAllPurchasedProducts)

router.route('/getTypes')
    .get(productController.getAllTypes)

router.route('/updatePrice')
    .put(productDetailsController.updatePrice)

router.route('/getDetails')
    .get(productDetailsController.getAllProducts)

router.route('/updateName')
    .put(productDetailsController.updateName)

router.route('/updateType')
    .put(productDetailsController.updateType)

module.exports = router