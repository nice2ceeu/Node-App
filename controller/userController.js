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
//post login
const userLogged = async(req, res)=>{
    try{
        
        const user = await UserShits.findOne(req.body)
        if (!user) {
            return res.status(404).send('User not found');
        }
        if(user){
            return res.status(200).json(user);
        }
        
    }catch(error){
        res.status(500).json({message: error.message})
    }
}
//registration
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
        const {userId,picture} = req.params;
        const user = await UserShits.findOne(userId)
        res.status(200).send(`Refresh for changes`)

        if(!user){
            res.status(500).send(`cant find user`)
        }
        if(user){
            res.update(picture)
        }
    }catch(error){
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
}

//adding items to cart
const addCart = async (req, res) => {
    const { userId ,item} = req.body;  
    
    try {
        const user = await UserShits.findById(userId);

        if (!user) {
            return res.status(404).send(`User not found with ID: ${userId}`);
        }

      
        user.cart.push(req.body); 
        await user.save();

        res.status(200).send(`${item} is added to cart`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

// quantity updating
const updateCart = async (req, res) => {
    const { userId, item, quantity, price } = req.body;
    
    try {
   
        const user = await UserShits.findById(userId);
        if (!user) {
            return res.status(404).send(`User not found with ID: ${userId}`);
        }

        
        const cartItem = user.cart.find(cartItem => cartItem.item === item);
        
        if (cartItem) {
            cartItem.quantity = quantity; 
            cartItem.price = price;
        } else {
            return res.status(404).send(`Cart item not found: ${item}`);
        }

        await user.save(); 
        res.status(200).send("Cart updated successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

//removing item from cart
    const deleteItem = async (req, res) =>{
        const {userId, item} = req.body
    try{
        const user = await UserShits.findById(userId)
        if(!user){
            return res.status(404).send(`User not found with ID: ${userId}`);
        }

        const cartItemIndex = user.cart.findIndex(cartItem => cartItem.item === item);
    if (cartItemIndex !== -1) {
        res.status(200).send(`${item} has was removed from cart `);
        user.cart.splice(cartItemIndex, 1); 
    }
        await user.save()
    }catch (error) {
        console.error(error);
        res.status(500).send("Server error");

    }
}
//ordering item from cart
const orderItem = async (req, res) =>{
    const {userId, item} = req.body
try{
    const user = await UserShits.findById(userId)
    if(!user){
        return res.status(404).send(`User not found with ID: ${userId}`);
    }

    const cartItemIndex = user.cart.findIndex(cartItem => cartItem.item === item);
if (cartItemIndex !== -1) {
    res.status(200).send(`Thanks! Find another item while waiting for your ${item}`);
    user.cart.splice(cartItemIndex, 1); 
}
    await user.save()
}catch (error) {
    console.error(error);
    res.status(500).send("Server error");

    }
}



module.exports = {getUser ,getOneUser, createUser, deleteUser, update ,addCart, updateCart, deleteItem, userLogged,orderItem}