const express = require('express')


const {getUser ,getOneUser, createUser, deleteUser, update ,addCart, updateCart, deleteItem,userLogged, orderItem} = require('../controller/userController')

const router = express();


router.post('/register', createUser);

router.get('/', getUser);

router.post('/login', getOneUser);

router.post('/logged',userLogged);

router.put('/update', update);

router.post('/cart',addCart);

router.put('/updateCart',updateCart);

router.delete('/deleteItem', deleteItem)

router.delete('/orderItem', orderItem)


// unused
router.delete('/delete/:id',deleteUser );


module.exports = router;
