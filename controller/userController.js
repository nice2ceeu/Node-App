
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
            return res.status(200).json(user);
        }else{
            return res.status(401).json({message:'Credentials don\'t match' });
        }
        
    }catch(error){
        res.send("Log in failed")
        res.status(500).json({message: error.message})
    }
}
//for register
// const createUser = async(req, res)=>{
//     try{
//         const {email} = req.params
//         const exist = await UserShits.findOne({email: email})
//         if(exist){
            
//             return res.status(409).send("Email already exists");
//         }else{
//             const user = await UserShits.create(req.body)
//             return res.status(200).send("Successfully Registered");
//         }
        

//     }catch(error){
//         return res.status(500).send("Must fill all fields")
//     }
// }
const createUser = async (req, res) => {
    try {
      const { email } = req.params;
      
      // Check if user already exists
      const exist = await UserShits.findOne({ email: email });
     
      // Create new user
      if(!exist){
      const user = await UserShits.create(req.body);
      
      return res.status(200).send("Successfully Registered");
    }
  
    } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).send("Email already exist");
    }
  };

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