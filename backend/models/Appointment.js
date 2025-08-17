const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dentistId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: Date,
  endTime: Date,
  bookAt: { type: Date, default: Date.now },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'canceled'], default: 'pending' },
  note: String,
  service: [
    {
      serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
      name: { type: String, required: true },
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);