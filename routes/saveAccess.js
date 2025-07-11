const express = require('express');
const router = express.Router();
const SaveAccess = require('../models/saveAccess');
const { authenticate, authorize } = require('../middleware/auth');

// ذخیره‌سازی یا به‌روزرسانی دسترسی‌ها
router.post('/save', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { userId, parentId, childrenIds } = req.body;
console.log(userId)
    // بررسی وجود دسترسی برای parentId و uaerId
    let saveAccess = await SaveAccess.findOne({ userId, parentId });

    if (saveAccess) {
      // به‌روزرسانی فرزندان: اضافه کردن جدیدها و حذف فرزندان غیرموجود
      const currentChildrenIds = saveAccess.childrenIds.map(id => id.toString());
      
      // اضافه کردن فرزندان جدید
      const newChildrenIds = childrenIds.filter(id => !currentChildrenIds.includes(id));
      saveAccess.childrenIds.push(...newChildrenIds);

      // حذف فرزندان غیرموجود
      saveAccess.childrenIds = saveAccess.childrenIds.filter(id => childrenIds.includes(id.toString()));

      await saveAccess.save();
      res.status(200).json({ message: 'دسترسی‌ها با موفقیت به‌روزرسانی شدند.', data: saveAccess });
    } else {
      // ایجاد رکورد جدید
      saveAccess = new SaveAccess({
        userId,
        parentId,
        childrenIds,
      });
      await saveAccess.save();
      res.status(201).json({ message: 'دسترسی‌ها با موفقیت ذخیره شدند.', data: saveAccess });
    }
  } catch (err) {
    console.error('Error saving or updating access:', err);
    res.status(400).json({ message: 'خطا در ذخیره‌سازی یا به‌روزرسانی دسترسی‌ها.', error: err.message });
  }
});

// دریافت دسترسی‌ها بر اساس uaerId
router.get('/:userId', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { userId } = req.params;

    const accessData = await SaveAccess.findOne({ userId }).populate('childrenIds', 'name family');
    if (!accessData) {
      return res.status(404).json({ message: 'دسترسی‌ای برای این کاربر یافت نشد.' });
    }

    res.status(200).json({ data: accessData });
  } catch (err) {
    console.error('Error fetching access data:', err);
    res.status(400).json({ message: 'خطا در دریافت اطلاعات دسترسی.', error: err.message });
  }
});

module.exports = router;