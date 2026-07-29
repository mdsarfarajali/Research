const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  _id: { type: String },
  userId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  specialization: [{ type: String }],
  bio: { type: String },
  phone: { type: String },
  officeLocation: { type: String },
  researchInterests: [{ type: String }],
  publications: [{ type: String, ref: 'Paper' }], // Using MongoDB relations
  totalCitations: { type: Number, default: 0 },
  hIndex: { type: Number, default: 0 },
  googleScholarUrl: { type: String },
  orcidId: { type: String },
  linkedinUrl: { type: String }
}, { timestamps: true });

facultySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Faculty', facultySchema);
