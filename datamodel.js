const mongoose = require('mongoose');

// Define the schema for your data
const dataSchema = new mongoose.Schema({
  filename: { type: String },
  'Att. Date': { type: String},
  InTime: { type: String},
  OutTime: { type: String},
  Shift: { type: String},
  '': { type: String},
  'S. InTime': { type: String},
  'S. OutTime': { type: String},
  'Work Dur.': { type: String},
  OT: { type: String},
  'Tot. Dur.': { type: String},
  LateBy: { type: String},
  EarlyGoingBy: { type: String},
  Status: { type: String},
  'Punch Records': { type: String},
});

// Create and export the model
const DataModel = mongoose.model('Data', dataSchema);

module.exports = DataModel;