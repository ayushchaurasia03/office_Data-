const mongoose = require('mongoose');


const attendanceSchema = new mongoose.Schema({
  'Att. Date': String,
  InTime: String,
  OutTime: String,
  Shift: String,
  '': String,
  'S. InTime': String,
  'S. OutTime': String,
  'Work Dur.': String,
  OT: String,
  'Tot. Dur.': String,
  LateBy: String,
  EarlyGoingBy: String,
  Status: String,
  'Punch Records': String,
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;