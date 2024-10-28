
const UserShits = require('../model/userModel')
const express = require('express')
const path = require('path')
const app = express()



app.use(express.json())
app.use(express.static('public'));

//get all for admin shit
const getUser = async(req, res)=>{
    try{
        const user = await UserShits.find(req.body)
        res.status(200).json(user)
    }catch(error){
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
}
//for login
const getOneUser = async(req, res)=>{
    try{
        const { email, password } = req.body;
    
        const user = await UserShits.findOne({email: email})
        if (!user) {
            return res.status(404).send('User not found');
        }

        if(user.email === email && user.password === password){
            return res.redirect('./dashboard.html')
        }else{
            res.send('Credentials don\'t match')
        }
        
    }catch(error){
        res.send("Log in failed")
        res.status(500).json({message: error.message})
    }
}
//for register
const createUser = async(req, res)=>{
    try{
        const user = await UserShits.create(req.body)
        res.status(200)
        res.send("Succesfully Registered")

    }catch(error){
        res.status(500)
        res.send("Must fill all fields")
    }
}

//deletion of acc. for admin shit
const deleteUser = async(req, res)=>{
    try{
        const {id} = req.params;
        const user = await UserShits.findByIdAndDelete(id)
        res.status(200).json(user)
    }catch(error){
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
}
//updating info and shits
const update = async(req, res)=>{
    try{
        const {id} = req.params;
        const user = await UserShits.findByIdAndUpdate(id, req.body)
        res.status(200).json(user)
    }catch(error){
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
}

module.exports = {getUser ,getOneUser, createUser, deleteUser, update }