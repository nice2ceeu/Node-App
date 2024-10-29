const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    age:{
        type: Number,
        required: true
    },
     createdAt: {
        type: Date,
        default: Date.now,
    },

    cart:{
        

        item:{
            type: String
        },
        price:{
            type: Number
        }
    }


});

const UserShits = mongoose.model('user', userSchema)

module.exports = UserShits;
