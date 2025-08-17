const mongoose = require('mongoose');
const { Schema } = mongoose;

const medicineSchema = new Schema({
  name:  { type: String, required: true },
  unit:  String,
  price: Number
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
