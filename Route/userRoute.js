const express = require('express')


const {getUser ,getOneUser, createUser, deleteUser, update } = require('../controller/userController')

const router = express();


router.post('/register', createUser);

router.get('/', getUser);

router.post('/login', getOneUser);

router.put('/update/:id', update);

// unused
router.delete('/delete/:id',deleteUser );


module.exports = router;
