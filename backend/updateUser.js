require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillhub')
  .then(async () => {
    let admin = await User.findOne({ email: 'admin@gmail.com' }).select('+password');
    if (!admin) {
      admin = await User.create({ name: 'Admin', email: 'admin@gmail.com', password: 'password123', role: 'admin' });
      console.log('Created admin@gmail.com');
    }
    admin.password = '123456';
    admin.role = 'admin';
    await admin.save();
    console.log('Updated admin@gmail.com password to 123456 and role to admin');

    let ujjwal = await User.findOne({ email: 'ujjwal@gmail.com' }).select('+password');
    if (ujjwal) {
      ujjwal.password = '123456';
      ujjwal.role = 'admin';
      await ujjwal.save();
      console.log('Updated ujjwal@gmail.com password to 123456 and role to admin');
    }

    process.exit(0);
  })
  .catch(console.error);
