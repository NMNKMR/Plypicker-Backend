const Cart = require('../models/cart');
const axios = require('axios');

//View cart to return user cart Items.
const viewCart = async (req, res) => {
    try {
        //Finding user through user ID (get from token)
        //Return cart items by replacing product id to exact product document.
        const userCart = await Cart.findOne({ user: req.user._id });

        //Error Handlers when cart not found or cart is Empty.
        if (!userCart) return res.status(400).json({ error: "user cart not found" });
        if (userCart.items.length === 0) return res.status(200).json({ error: "cart Is Empty" })

        res.status(200).json({ error: null, cart: userCart.items });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error occured while fetching Cart Items" })
    }
}

//Add Product to cart
const addProductToCart = async (req, res) => {
    //API Call to retrieve product.
    const product = await axios.get(`https://64e0caef50713530432cafa1.mockapi.io/api/products/${req.params.productId}`);

    //creating cart having quantity default to 1.
    const cartItem = {
        pid: product.data.id,
        name: product.data.productName,
        image: product.data.image,
        price: product.data.price,
        quantity: 1
    }

    Cart.findOne({ user: req.user._id })
        .then(userCart => {
            const hasIndex = userCart.items.findIndex((product)=> product.pid === req.params.productId)
            if(hasIndex >= 0) {
                req.query.update = "increase"; 
                return updateQuantity(req, res)
            }
            else {
                userCart.items.push(cartItem)//Adding cart document to Items Array (cart items array).
                userCart.save();
                res.status(200).json({ message: "Product added to Cart successfully", userCart })
            }
        })
        .catch(error => res.status(500).json({ error }))
}

//Update Quantity of product in cart (+ or -).
const updateQuantity = (req, res) => {
    Cart.findOneAndUpdate(
        { user: req.user._id, 'items.pid': req.params.productId },
        { $inc: { 'items.$.quantity': (req.query.update === "increase") ? 1 : -1 } }, //increase or decrease
        { new: true } // This option returns the updated document
    )
        .then(updateCart => {
            //if quantity gets 0 then execute remove product from cart.
            if (updateCart.items.find(item => item.pid.equals(req.params.productId)).quantity === 0) removeProductFromCart(req, res);
            else res.status(200).json({ message: "Quantity updated successfully", updateCart })
        })
        .catch(error => res.status(500).json({ error }));
}

//Remove Product from cart.
const removeProductFromCart = (req, res) => {
    Cart.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { items: { pid: req.params.productId } } },
        { new: true }
    )
        .then(updateCart => res.status(200).json({ message: "Product removed successfully", updateCart }))
        .catch(error => res.status(500).json({ error }));
}

module.exports = { viewCart, addProductToCart, updateQuantity, removeProductFromCart }