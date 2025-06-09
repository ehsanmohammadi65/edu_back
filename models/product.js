const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  query: { type: String, required: true },
  answer: { type: String, required: true }
});

const dataSchema = new mongoose.Schema({
  title: { type: String, required: true },
  des: { type: String, required: true },
  questions: { type: [questionSchema], required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  categore: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  tag: [{ type: String }],
  img: { type: Object, default: {} },
  price:{type:String,default:'0'}
}, { timestamps: true });

module.exports = mongoose.model('Product', dataSchema);
