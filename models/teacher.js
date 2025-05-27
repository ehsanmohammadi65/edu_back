const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  family: { type: String, required: true },
  nationalCode: { type: String, required: true, unique: true },
  photo: { type: String }, // آدرس فایل تصویر
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Teacher', teacherSchema);
