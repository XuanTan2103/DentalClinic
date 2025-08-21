const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const serviceRouters = require('./routes/service');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/service', serviceRouters);

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;