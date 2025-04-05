const mongoose = require('mongoose');

const timeValueSchema = new mongoose.Schema({
  timestamp: Date,
  value: Number,
}, { _id: false });

const appUsageSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  cpu: [timeValueSchema],
  memory: [timeValueSchema],
  disk: [timeValueSchema],
  network: [timeValueSchema],
});

module.exports = mongoose.model('AppUsage', appUsageSchema);
