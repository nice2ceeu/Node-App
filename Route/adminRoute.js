const express = require('express');
const {
  getDashboard,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controller/adminController');

const router = express.Router();

router.use((req, res, next) => {
  const adminKey = process.env.ADMIN_KEY;

  if (adminKey && req.get('x-admin-key') !== adminKey) {
    return res.status(401).json({ message: 'A valid admin key is required.' });
  }

  next();
});

router.get('/dashboard', getDashboard);

router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
