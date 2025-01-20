const express = require('express')


const {getUser ,getOneUser, createUser, deleteUser, update ,addCart, updateCart, deleteItem,userLogged, orderItem} = require('../controller/userController')

const router = express();


router.post('/node-app-lzb6.onrender.com/register', createUser);

router.get('/node-app-lzb6.onrender.com/', getUser);

router.post('/node-app-lzb6.onrender.com/login', getOneUser);

router.post('/node-app-lzb6.onrender.com/logged',userLogged);

router.put('/node-app-lzb6.onrender.com/update', update);

router.post('/node-app-lzb6.onrender.com/cart',addCart);

router.put('/node-app-lzb6.onrender.com/updateCart',updateCart);

router.delete('/node-app-lzb6.onrender.com/deleteItem', deleteItem)

router.delete('/node-app-lzb6.onrender.com/orderItem', orderItem)


// unused
router.delete('/delete/:id',deleteUser );


module.exports = router;
