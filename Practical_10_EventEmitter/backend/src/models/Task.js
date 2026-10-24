const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    assignedTo: { type: String, trim: true, default: 'unassigned' },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
    status: { type: String, enum: ['open', 'completed'], default: 'open' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
