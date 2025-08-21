const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceSchema = new Schema({
  name:        { type: String, required: true },
  description: { type: String, required: true },
  duration:    { type: Number, required: true },
  price:       { type: Number, required: true },
  type: { type: String, required: true },
  guarantee: { type: String, required: true },
  image: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);