const mongoose = require('mongoose');

const saveAccessSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // ارجاع به مدل کاربر والد
        required: true,
      },
    parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // ارجاع به مدل کاربر والد
    required: true,
  },
  childrenIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductChild', // ارجاع به مدل فرزندان
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // تاریخ ایجاد خودکار
  },
});

module.exports = mongoose.model('SaveAccess', saveAccessSchema);