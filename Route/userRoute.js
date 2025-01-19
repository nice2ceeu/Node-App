const express = require('express')


const {getUser ,getOneUser, createUser, deleteUser, update ,addCart, updateCart, deleteItem,userLogged, orderItem} = require('../controller/userController')

const router = express();


router.post('node-app-y9kl.onrender.com/register', createUser);

router.get('node-app-y9kl.onrender.com/', getUser);

router.post('node-app-y9kl.onrender.com/login', getOneUser);

router.post('node-app-y9kl.onrender.com/logged',userLogged);

router.put('node-app-y9kl.onrender.com/update', update);

router.post('node-app-y9kl.onrender.com/cart',addCart);

router.put('node-app-y9kl.onrender.com/updateCart',updateCart);

router.delete('node-app-y9kl.onrender.com/deleteItem', deleteItem)

router.delete('node-app-y9kl.onrender.com/orderItem', orderItem)


// unused
router.delete('node-app-y9kl.onrender.com/delete/:id',deleteUser );


module.exports = router;
