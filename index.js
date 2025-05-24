const express=require('express');
const cors=require('cors')
const bodyParser = require('body-parser')
const category = require('./model/category');
const mongoose = require('mongoose');
const multer=require('multer')
const fs = require('fs');
const path = require('path');

// اتصال به MongoDB
mongoose.connect('mongodb://localhost:27017/edu', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const app = express()

app.use(cors());

// پیکربندی multer برای آپلود عکس
// ایجاد پوشه اگر وجود نداشته باشد
const uploadDir = 'uploads/img/cat';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// پیکربندی multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.post('/updatecategory', upload.single('image'), async (req, res) => {
  try {
    const { id, title, slug, parrent } = req.body;
    console.log(req.body)

    // پیدا کردن رکورد قبلی
    const existingCategory = await category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({ success: false, message: 'دسته‌بندی پیدا نشد' });
    }

    // بررسی اگر عکس جدید آمده و با قبلی فرق داشت
    let imgPath = existingCategory.img;
    if (req.file) {
      const newImagePath = `/uploads/img/cat/${req.file.filename}`;

      // اگر عکس قبلی وجود داشت و فرق داشت، حذفش کن
      if (existingCategory.img && existingCategory.img !== newImagePath) {
        const fullOldPath = path.join(__dirname, existingCategory.img);
        if (fs.existsSync(fullOldPath)) {
          fs.unlinkSync(fullOldPath);
        }
      }

      imgPath = newImagePath;
    }

    // بروزرسانی اطلاعات
    existingCategory.title = title;
    existingCategory.slug = slug;
    existingCategory.parrent = parrent;
    existingCategory.img = imgPath;

    await existingCategory.save();

    res.status(200).json({ success: true, data: existingCategory });
  } catch (err) {
    console.error('خطا در بروزرسانی دسته‌بندی:', err);
    res.status(500).json({ success: false, message: 'خطای سرور' });
  }
});

app.post('/categoryset', upload.single('image'), async (req, res) => {
  try {
    const { title, slug, parrent } = req.body;
const imgPath = req.file ? `/uploads/img/cat/${req.file.filename}` : undefined;

    const newCategory = new category({
      title,
      slug,
      img: imgPath,
      parrent
    });

    await newCategory.save();
    res.status(201).json({
      success: true,
      data: newCategory
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});
app.use('/categorylist',async (req, res) =>{
  try {
    const list = await category.find({}); // عملیات غیرهمزمان
    console.log(list); // چاپ کردن داده‌ها در کنسول سرور
    res.json({data:list}); // ارسال داده‌ها به کلاینت به صورت JSON
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).send('Server Error');
  }
})
app.use(bodyParser.json());
app.use('/uploads',express.static(path.join(__dirname,'uploads/img/')))
app.post('/deletecategory', async (req, res) => {
  console.log("okkkk")
  const { id } = req.body;

  try {
    const cat = await category.findById(id);
    if (!cat) {
      return res.status(404).json({ success: false, message: 'دسته‌بندی پیدا نشد' });
    }

    // حذف عکس در صورت وجود
    if (cat.img) {
      const imagePath = path.join(__dirname, cat.img);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // حذف دسته‌بندی اصلی
    await category.findByIdAndDelete(id);

    // حذف زیرشاخه‌ها
    await category.deleteMany({ parrent: id });

    res.status(200).json({ success: true, message: 'با موفقیت حذف شد' });
  } catch (err) {
    console.error('خطا در حذف دسته‌بندی:', err);
    res.status(500).json({ success: false, message: 'خطای سرور' });
  }
});




app.listen(5000, () => console.log('سرور در حال اجرا در پورت 3000'));

