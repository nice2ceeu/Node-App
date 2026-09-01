const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    picture:{
        type: String,
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
    user_role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true
    },
    age:{
        type: Number,
        required: true
    },
     createdAt: {
        type: Date,
        default: Date.now,
    },

    cart:[
            {
            imageUrl: {
                type: String,
                
            },
            item:{
                type: String
            },
            price:{
                type: Number
            },
            quantity:{
                type: Number
            }
        }
    ]

});

const UserShits = mongoose.model('user', userSchema)

module.exports = UserShits;
