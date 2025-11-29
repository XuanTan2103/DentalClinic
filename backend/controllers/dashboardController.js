const Appointment = require('../models/Appointment');
const Bill = require('../models/Bill');
const User = require('../models/User');
const Review = require('../models/Review');
const mongoose = require('mongoose');

const toNum = (v) =>
    typeof v === 'object' && v !== null && v._bsontype === 'Decimal128'
        ? Number(v.toString())
        : Number(v || 0);

function getDateRanges(period, dateParam) {
    let start, end;
    let targetDate;
    
    if (dateParam) {
        const dateParts = dateParam.split('-');
        if (dateParts.length !== 3) {
            throw new Error('Invalid date format. Expected YYYY-MM-DD');
        }
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; 
        const day = parseInt(dateParts[2], 10);
        targetDate = new Date(year, month, day);
        if (isNaN(targetDate.getTime())) {
            throw new Error('Invalid date format. Expected YYYY-MM-DD');
        }
    } else {
        targetDate = new Date();
    }
    
    if (period === 'day') {
        start = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
        end = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);
    } else if (period === 'month') {
        start = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
        end = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (period === 'year') {
        start = new Date(targetDate.getFullYear(), 0, 1);
        end = new Date(targetDate.getFullYear(), 11, 31, 23, 59, 59, 999);
    } else {
        throw new Error('Invalid period. Must be "day", "month", or "year"');
    }
    
    return { start, end };
}

const dashboardController = {
    getAppointmentStats: async (req, res) => {
        try {
            const { period = 'day', date } = req.query; 
            
            const { start, end } = getDateRanges(period, date);
            
            const total = await Appointment.countDocuments({
                createdAt: { $gte: start, $lte: end }
            });
            
            const confirmed = await Appointment.countDocuments({
                status: 'confirmed',
                createdAt: { $gte: start, $lte: end }
            });
            
            const rejected = await Appointment.countDocuments({
                status: 'rejected',
                createdAt: { $gte: start, $lte: end }
            });
            
            const pending = total - confirmed - rejected;
            
            return res.status(200).json({
                message: 'Get appointment stats successfully',
                period,
                data: {
                    total,
                    confirmed,
                    rejected,
                    pending
                }
            });
        } catch (error) {
            console.error('Error getting appointment stats:', error);
            return res.status(500).json({
                message: 'Failed to get appointment stats',
                error: error.message
            });
        }
    },

    getServiceUsageStats: async (req, res) => {
        try {
            const { period = 'day', date } = req.query;
            
            const { start, end } = getDateRanges(period, date);
            
            const bills = await Bill.find({
                status: 'Paid',
                createdAt: { $gte: start, $lte: end }
            }).select('serviceItems');
            
            const serviceMap = new Map();
            
            bills.forEach(bill => {
                if (bill.serviceItems && Array.isArray(bill.serviceItems)) {
                    bill.serviceItems.forEach(item => {
                        const serviceId = item.serviceId?.toString() || item.serviceId;
                        const serviceName = item.name || 'Unknown Service';
                        const quantity = item.quantity || 1;
                        
                        if (serviceMap.has(serviceId)) {
                            const existing = serviceMap.get(serviceId);
                            existing.quantity += quantity;
                        } else {
                            serviceMap.set(serviceId, {
                                serviceId,
                                name: serviceName,
                                quantity
                            });
                        }
                    });
                }
            });
            
            const serviceUsage = Array.from(serviceMap.values())
                .sort((a, b) => b.quantity - a.quantity)
                .slice(0, 10); 
            
            return res.status(200).json({
                message: 'Get service usage stats successfully',
                period,
                data: serviceUsage
            });
        } catch (error) {
            console.error('Error getting service usage stats:', error);
            return res.status(500).json({
                message: 'Failed to get service usage stats',
                error: error.message
            });
        }
    },

    getRevenueStats: async (req, res) => {
        try {
            const { period = 'day', date } = req.query; 
            
            const { start, end } = getDateRanges(period, date);
            
            const bills = await Bill.find({
                status: 'Paid',
                createdAt: { $gte: start, $lte: end }
            }).select('finalAmount createdAt');
            
            let revenueData = [];
            
            if (period === 'day') {
                const hourMap = new Map();
                bills.forEach(bill => {
                    const hour = new Date(bill.createdAt).getHours();
                    const revenue = toNum(bill.finalAmount);
                    
                    if (hourMap.has(hour)) {
                        hourMap.set(hour, hourMap.get(hour) + revenue);
                    } else {
                        hourMap.set(hour, revenue);
                    }
                });
                
                for (let i = 7; i <= 22; i++) {
                    revenueData.push({
                        label: `${i}:00`,
                        value: hourMap.get(i) || 0
                    });
                }
            } else if (period === 'month') {
                const dayMap = new Map();
                bills.forEach(bill => {
                    const billDate = new Date(bill.createdAt);
                    const day = billDate.getDate();
                    const revenue = toNum(bill.finalAmount);
                    
                    if (dayMap.has(day)) {
                        dayMap.set(day, dayMap.get(day) + revenue);
                    } else {
                        dayMap.set(day, revenue);
                    }
                });
                
                let targetMonth;
                if (date) {
                    const dateParts = date.split('-');
                    if (dateParts.length === 3) {
                        const year = parseInt(dateParts[0], 10);
                        const month = parseInt(dateParts[1], 10) - 1; 
                        const day = parseInt(dateParts[2], 10);
                        targetMonth = new Date(year, month, day);
                    } else {
                        targetMonth = new Date();
                    }
                } else {
                    targetMonth = new Date();
                }
                const daysInMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate();
                for (let i = 1; i <= daysInMonth; i++) {
                    revenueData.push({
                        label: `Ngày ${i}`,
                        value: dayMap.get(i) || 0
                    });
                }
            } else if (period === 'year') {
                const monthMap = new Map();
                bills.forEach(bill => {
                    const date = new Date(bill.createdAt);
                    const month = date.getMonth(); 
                    const revenue = toNum(bill.finalAmount);
                    
                    if (monthMap.has(month)) {
                        monthMap.set(month, monthMap.get(month) + revenue);
                    } else {
                        monthMap.set(month, revenue);
                    }
                });
                
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                for (let i = 0; i < 12; i++) {
                    revenueData.push({
                        label: monthNames[i],
                        value: monthMap.get(i) || 0
                    });
                }
            }
            
            const totalRevenue = bills.reduce((sum, bill) => sum + toNum(bill.finalAmount), 0);
            
            return res.status(200).json({
                message: 'Get revenue stats successfully',
                period,
                totalRevenue,
                data: revenueData
            });
        } catch (error) {
            console.error('Error getting revenue stats:', error);
            return res.status(500).json({
                message: 'Failed to get revenue stats',
                error: error.message
            });
        }
    },

    getQuickMetrics: async (req, res) => {
        try {
            const now = new Date();
            
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
            
            const todayAppointments = await Appointment.countDocuments({
                date: { 
                    $gte: todayStart, 
                    $lte: todayEnd 
                }
            });

            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            
            const newCustomersThisMonth = await User.countDocuments({
                role: 'Customer',
                createdAt: { 
                    $gte: monthStart, 
                    $lte: monthEnd 
                }
            });

            const paidBillsThisMonth = await Bill.find({
                status: 'Paid',
                createdAt: { 
                    $gte: monthStart, 
                    $lte: monthEnd 
                }
            }).select('finalAmount');
            
            const monthlyRevenue = paidBillsThisMonth.reduce((sum, bill) => {
                return sum + toNum(bill.finalAmount);
            }, 0);

            const allReviews = await Review.find().select('rating');
            let averageRating = 0;
            
            if (allReviews.length > 0) {
                const totalRating = allReviews.reduce((sum, review) => {
                    return sum + (review.rating || 0);
                }, 0);
                averageRating = totalRating / allReviews.length;
            }

            return res.status(200).json({
                message: 'Get quick metrics successfully',
                data: {
                    todayAppointments,
                    newCustomersThisMonth,
                    monthlyRevenue,
                    averageRating: parseFloat(averageRating.toFixed(1))
                }
            });
        } catch (error) {
            console.error('Error getting quick metrics:', error);
            return res.status(500).json({
                message: 'Failed to get quick metrics',
                error: error.message
            });
        }
    }
};

module.exports = dashboardController;