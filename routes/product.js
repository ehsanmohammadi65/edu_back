const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { authenticate, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// تنظیم مسیر ذخیره فایل و نام فایل
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/img/product');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // مثلا 1716790149671.jpg
  }
});

const upload = multer({ storage });
router.post('/', authenticate, authorize('admin'), upload.single('photo'), async (req, res) => {
 console.log('okkkkk')
  try {
    const data = {
      ...req.body,
      photo: req.file ? `/uploads/${req.file.filename}` : undefined
    };

    if (req.body._id) {
      const productup = await Product.findByIdAndUpdate(req.body._id, data, { new: true });
      if (!productup) {
        return res.status(404).json({ message: 'محصول یافت نشد' });
      }
      res.status(201).json({ message: 'محصول ویرایش شد', Products: productup });
    } else {
      const product = new Product(data);
      await product.save();
      console.log({ message: 'محصول ثبت شد', product })
      res.status(201).json({ message: 'محصول ثبت شد', product });
    }

  } catch (err) {
    res.status(400).json({ message: 'خطا در ثبت یا ویرایش محصول', error: err.message });
  }
});



// 📌 دریافت لیست مدرس‌ها
router.get('/', authenticate, authorize(['admin', 'user']), async (req, res) => {
  const product = await Product.find();
  res.json(product);
});



module.exports = router;