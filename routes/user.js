const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { authenticate, authorize } = require('../middleware/auth');
require("dotenv").config();

// Register
router.post('/register', authenticate, authorize(['admin']), async (req, res) => {
  try {
    console.log(req.body.user)
    const userData = {
      name: req.body.user.name,
      family: req.body.user.family,
      nationalCode: req.body.user.nationalCode, // اصلاح شده
      mobile: req.body.user.mobile,
      role: req.body.user.role,
      createdAt: Date.now(), // اصلاح شده
      active: true, // اصلاح شده
      password: req.body.user.password,
    };
    
    if(req.body.user._id){
                const user = new User();

    const update = await User.findByIdAndUpdate(req.body.user._id, req.body.user, { new: true });
    res.status(201).json(update);

    }else{
          const user = new User(userData);
              await user.save();
    res.status(201).json(user);

    }
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ 
      message: err.message,
      errors: err.errors // برای نمایش خطاهای اعتبارسنجی
    });
  }
});
// Login
router.post('/login', async (req, res) => {
  const { nationalCode, password } = req.body;
  const user = await User.findOne({ nationalCode });
    console.log(await user.comparePassword(password))
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

// Get all users (admin only)
router.post('/', async (req, res) => {
  console.log("ok")
  const users = await User.find();
  console.log(users)
  res.json(users);
});


// Delete user (admin only)
router.post('/delete', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
