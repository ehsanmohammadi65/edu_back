const express=require('express');
const cors=require('cors')
const bodyParser = require('body-parser')
const category = require('./middleware/category');
const mongoose = require('mongoose');
const multer=require('multer')

// اتصال به MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const app = express()
app.use(bodyParser.json());
app.use(cors());
// پیکربندی multer برای آپلود عکس
const upload = multer({ dest: 'uploads/img/cat' });

app.use('/categoryset',async(req,res)=>{
try{
    const {title,slug,img,parrent} =req.body;

    const imgpatch = req.file ? `/uploads/${req.file.filename}` : undefined;

  const newCategory = new category({
      title,
      slug,
      img: imgpatch,
      parrent
    });
        await newCategory.save(); // ذخیره در دیتابیس
   res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });}

})
app.listen(3000, () => console.log('سرور در حال اجرا در پورت 3000'));

