const mongoose = require('mongoose');
const { Schema } = mongoose;

const medicalRecordSchema = new Schema({
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dentistId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: false },
    diagnosis: { type: String, required: true },
    recordDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['In Progress', 'Completed'], default: 'In Progress' },
    followUpDate: { type: Date, required: false },
    servicesUsed: [
        {
            serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
            name: { type: String, required: true },
            quantity: { type: Number, default: 1 }
        }
    ],
    prescriptions: [
        {
            medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            instructions: { type: String, required: true }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);