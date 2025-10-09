const express = require('express');
const cors = require('cors');
const http = require("http");
require('dotenv').config();
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const serviceRouters = require('./routes/service');
const chatbotRoutes = require('./routes/chatbot');
const conversationRoutes = require("./routes/conversation");
const messageRoutes = require("./routes/message");
const dentistProfileRoutes = require("./routes/dentistProfile");
const dentistWorkingTimeRoutes = require("./routes/dentistWorkingTime");
const appointmentRoutes = require("./routes/appointment");
const initSocket = require("./config/socket");

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/service', serviceRouters);
app.use('/chatbot', chatbotRoutes);
app.use('/conversation', conversationRoutes);
app.use('/message', messageRoutes);
app.use('/dentistProfile', dentistProfileRoutes);
app.use('/dentistWorkingTime', dentistWorkingTimeRoutes);
app.use('/appointment', appointmentRoutes);

const server = http.createServer(app);
const io = initSocket(server);

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;