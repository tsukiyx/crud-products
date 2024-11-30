const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    quantity: {type: Number, required: true},
    price: {type: Number, required: true},
    description: String,
}, {timestamps: true})

module.exports = mongoose.model('Product', productSchema)