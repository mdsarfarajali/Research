const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const paperSchema = new mongoose.Schema({
  _id: { type: String, default: () => `paper_${uuidv4().slice(0, 8)}` },
  title: { type: String, required: true },
  abstract: { type: String, required: true },
  authors: [{ type: String }],
  category: { type: String, required: true },
  keywords: [{ type: String }],
  status: { type: String, required: true, default: 'submitted' },
  submittedBy: { type: String, required: true },
  submittedByName: { type: String, required: true },
  doi: { type: String },
  journal: { type: String },
  publicationDate: { type: Date },
  citations: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 }
}, { timestamps: true });

paperSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Paper', paperSchema);
