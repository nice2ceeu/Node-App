const productsSchema = require('../model/productModel')


//for fetching all products
const getProds = async(req, res)=>{
    try{
        const product = await productsSchema.find(req.body)
        res.json(product);
        
        
    }catch(error){
        console.log(error.message)
        res.status(500).json({message: error.message})
        
    }
}
// searching one shit
const getOneProd = async(req, res)=>{
    try{
        const { item } = req.params;
        const product = await productsSchema.findOne({item: item});
        res.send(product).json()
    }catch(error){
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
}

//seller side adding products
const createProd = async(req, res)=>{
    try{
        const product = await productsSchema.create(req.body)
        res.status(200).json(product)

    }catch(error){
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
}

//seller side deleting producs
const deleteProd = async(req, res)=>{
    try{
        const {id} = req.params;
        const product = await productsSchema.findByIdAndDelete(id)
        res.status(200).json(product)
    }catch(error){
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
}

//updationg info of products
const updateProd = async(req, res)=>{
        const {item , quantity} = req.body;
        
    try{
        
        const product = await productsSchema.findOne({item:item})
       

        if(!product){
            res.status(404).json(product)
        }
        if(product){
            product.quantity = product.quantity - quantity
            await product.save()
            res.status(200).send(`${product.item} has been order`)
            
        }
        
    }catch(error){
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
}

module.exports = {getProds ,getOneProd, createProd, deleteProd, updateProd }