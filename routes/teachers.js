const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher');
const { authenticate, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// تنظیم مسیر ذخیره فایل و نام فایل
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/img/teachers');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // مثلا 1716790149671.jpg
  }
});

const upload = multer({ storage });
router.post('/', authenticate, authorize('admin'), upload.single('photo'), async (req, res) => {
  try {
    const data = {
      ...req.body,
      photo: req.file ? `/uploads/${req.file.filename}` : undefined
    };

    if (req.body._id) {
      const teacherup = await Teacher.findByIdAndUpdate(req.body._id, data, { new: true });
      if (!teacherup) {
        return res.status(404).json({ message: 'مدرس یافت نشد' });
      }
      res.status(201).json({ message: 'مدرس ویرایش شد', teacher: teacherup });
    } else {
      const teacher = new Teacher(data);
      await teacher.save();
      res.status(201).json({ message: 'مدرس ثبت شد', teacher });
    }

  } catch (err) {
    res.status(400).json({ message: 'خطا در ثبت یا ویرایش مدرس', error: err.message });
  }
});



// 📌 دریافت لیست مدرس‌ها
router.get('/', authenticate, authorize(['admin', 'user']), async (req, res) => {
  const teachers = await Teacher.find();
  res.json(teachers);
});

// 📌 ویرایش مدرس
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const updated = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'مدرس یافت نشد' });
    res.json({ message: 'مدرس بروزرسانی شد', teacher: updated });
  } catch (err) {
    res.status(400).json({ message: 'خطا در بروزرسانی', error: err.message });
  }
});

module.exports = router;
