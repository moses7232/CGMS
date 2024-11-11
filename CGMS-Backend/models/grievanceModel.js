const mongoose = require('mongoose');

const GrievanceSchema = new mongoose.Schema({
  description: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isAnonymous: { type: Boolean, default: false },
  trackingCode: { type: String, required: false }, // Make it not required, but still unique
  resolutionNote: { type: String, default: '' },
  department: { type: String, default: '' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  username: { type: String, required: function () { return !this.isAnonymous; } }, // Required if not anonymous
  email: { type: String, required: function () { return !this.isAnonymous; } }, // Required if not anonymous
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String }
  }
});

module.exports = mongoose.model('Grievance', GrievanceSchema);
