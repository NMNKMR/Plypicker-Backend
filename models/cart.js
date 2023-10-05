const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  pid: {type: Number, required: true},
  name: {type: String, required: true},
  image: {type: String},
  price: {type: Number, required: true},
  quantity: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //User Document ID.
  items: [cartItemSchema], //Array of Objects containing Product and it's quantity.
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;