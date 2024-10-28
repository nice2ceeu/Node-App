const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({

    item:{
        type: String,
        required: true,
        unique:true
    },
    price:{
        type: Number,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },

    imageUrl: {
        type: String,
        required:false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
    
});

const productsSchema = mongoose.model('product', productSchema)


module.exports = productsSchema;