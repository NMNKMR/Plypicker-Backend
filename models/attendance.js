const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //User Document ID.
  timestamps: [{ type: String}]
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;