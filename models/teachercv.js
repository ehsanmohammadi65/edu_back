const mongoose = require('mongoose');

const teacherCVSchema = new mongoose.Schema({
  teacher_id: { type: String, required: true },
  cv: { type: String, required: true },
  active: { type: Boolean, default: true },

});

module.exports = mongoose.model('TeacherCV', teacherCVSchema);
