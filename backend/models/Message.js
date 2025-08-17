const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation',required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);