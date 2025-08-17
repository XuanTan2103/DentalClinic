const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceSchema = new Schema({
  name:        { type: String, required: true },
  description: String,
  duration:    Number,
  price:       Number
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);