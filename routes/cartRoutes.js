const express = require('express');
const router = express.Router();
//Importing Cart Controllers
const {viewCart, addProductToCart, updateQuantity, removeProductFromCart} = require('../controllers/cartController');

router.get('/', viewCart); //Get Request to view Cart.

router.post('/add/:productId', addProductToCart); //Post Request to Add Product to Cart.

router.put('/update/:productId', updateQuantity); //Put Request to Update Quantity of Product in Cart.

router.delete('/remove/:productId', removeProductFromCart); //Remove Product from Cart.

module.exports = router;