const mongoose = require('mongoose');
const Product = require('../model/productModel');
const User = require('../model/userModel');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const sendError = (res, error) => {
  if (error?.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'value';
    return res.status(409).json({ message: `That ${field} is already in use.` });
  }

  if (error?.name === 'ValidationError') {
    const message = Object.values(error.errors).map((item) => item.message).join(' ');
    return res.status(400).json({ message });
  }

  console.error(error);
  return res.status(500).json({ message: 'Something went wrong on the server.' });
};

const getDashboard = async (req, res) => {
  try {
    const [products, users, inventory] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Product.aggregate([
        { $group: { _id: null, units: { $sum: '$quantity' }, value: { $sum: { $multiply: ['$price', '$quantity'] } } } },
      ]),
    ]);

    res.json({
      products,
      users,
      units: inventory[0]?.units || 0,
      inventoryValue: inventory[0]?.value || 0,
    });
  } catch (error) {
    sendError(res, error);
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    sendError(res, error);
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      item: req.body.item?.trim(),
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      imageUrl: req.body.imageUrl?.trim() || '',
    });
    res.status(201).json(product);
  } catch (error) {
    sendError(res, error);
  }
};

const updateProduct = async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid product ID.' });

  try {
    const updates = {
      item: req.body.item?.trim(),
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      imageUrl: req.body.imageUrl?.trim() || '',
    };
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (error) {
    sendError(res, error);
  }
};

const deleteProduct = async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid product ID.' });

  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product deleted.' });
  } catch (error) {
    sendError(res, error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    sendError(res, error);
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name?.trim(),
      email: req.body.email?.trim().toLowerCase(),
      password: req.body.password,
      age: Number(req.body.age),
      picture: req.body.picture?.trim() || '',
    });
    const result = user.toObject();
    delete result.password;
    res.status(201).json(result);
  } catch (error) {
    sendError(res, error);
  }
};

const updateUser = async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid user ID.' });

  try {
    const updates = {
      name: req.body.name?.trim(),
      email: req.body.email?.trim().toLowerCase(),
      age: Number(req.body.age),
      picture: req.body.picture?.trim() || '',
    };
    if (req.body.password) updates.password = req.body.password;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (error) {
    sendError(res, error);
  }
};

const deleteUser = async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid user ID.' });

  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User deleted.' });
  } catch (error) {
    sendError(res, error);
  }
};

module.exports = {
  getDashboard,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
