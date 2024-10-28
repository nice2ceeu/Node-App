const express = require('express')


const {getUser ,getOneUser, createUser, deleteUser, update } = require('../controller/userController')

const router = express();


router.post('/register', createUser);

router.get('/', getUser);

router.post('/login', getOneUser);


// unused
router.delete('/delete/:id',deleteUser );

router.put('/update/:id', update);
module.exports = router;
