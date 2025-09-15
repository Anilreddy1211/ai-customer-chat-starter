const mongoose = require('mongoose');

const CompanyDataSchema = new mongoose.Schema({
  title: String,
  content: String,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CompanyData', CompanyDataSchema);
