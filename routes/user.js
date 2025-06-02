const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { authenticate, authorize } = require('../middleware/auth');
require("dotenv").config();

// Register
router.post('/register', authenticate, authorize(['admin']), async (req, res) => {
     console.log(req.body)

  try {
    const userData = {
      name: req.body.name,
      family: req.body.family,
      nationalCode: req.body.nationalCode, // اصلاح شده
      mobile: req.body.mobile,
      role: req.body.role,
      createdAt: Date.now(), // اصلاح شده
      active: true, // اصلاح شده
      password: req.body.password,
    };
    
    if(req.body._id){
                const user = new User();
//: :happy
    const update = await User.findByIdAndUpdate(req.body._id, req.body, { new: true });
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
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  console.log("ok")
  const users = await User.find();
  console.log(users)
  res.json(users);
});


// Delete user (admin only)
router.post('/delete', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body._id);

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
