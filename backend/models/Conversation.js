const mongoose = require('mongoose');
const { Schema } = mongoose;

const conversationSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  staffIds:   [{ type: Schema.Types.ObjectId, ref: 'User', required: true }]
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);