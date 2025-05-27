const mongoose = require('mongoose');
const { Schema } = mongoose;
const CategorySchema = new Schema({
title:{
    type: String,
    required: [true, 'عنوان دسته ضروری است'], // اعتبارسنجی الزامی
    trim: false // حذف فاصله‌های اضافه
  },
  slug:{
    type: String,
    required: [true, 'ضروری است Slug'], // اعتبارسنجی الزامی
    trim: false // حذف فاصله‌های اضافه
  },
  img:{
    type: String,
    required: false, // اعتبارسنجی الزامی
    trim: false // حذف فاصله‌های اضافه
  },
  parrent:{
    type:String,
    required:false,
  },
   createdAt: {
    type: Date,
    default: Date.now // تاریخ ایجاد خودکار
  }
});
const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
