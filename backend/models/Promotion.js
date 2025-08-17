const mongoose = require('mongoose');
const { Schema } = mongoose;

const promotionSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    service: [
        {
            serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Promotion', promotionSchema);