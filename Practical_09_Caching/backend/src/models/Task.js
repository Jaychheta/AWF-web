const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    status: { type: String, enum: ['pending', 'done'], default: 'pending' },
    priority: { type: Number, default: 1, min: 1, max: 5 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
