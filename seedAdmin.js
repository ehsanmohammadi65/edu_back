const mongoose = require('mongoose');
const User = require('./models/user'); // مسیر درست مدل

async function createAdmin() {
  try {
    await mongoose.connect('mongodb://localhost:27017/edu');

    const existing = await User.findOne({ nationalCode: '4199792155' });
    if (existing) {
      console.log('⚠️  Admin user already exists.');
      return;
    }

    const admin = new User({
      name: 'احسان',
      family: 'محمدی',
      nationalCode: '4199792155',
      mobile: '09167088461',
      password: '136567Mary', // بدون hash دستی!
      role: 'admin',
      active: true,
    });

    await admin.save();
    console.log('✅ Admin user created successfully.');
  } catch (err) {
    console.error('❌ Error creating admin user:', err);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
