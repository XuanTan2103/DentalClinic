const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

let ioInstance = null;

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true   
    },
  });

  // middleware auth qua socket handshake
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Normalize payload to always have user id at socket.user.id
      socket.user = {
        id: decoded.userId || decoded.id,
        role: decoded.role,
        fullName: decoded.fullName,
      };
      if (!socket.user.id) {
        return next(new Error("Authentication error"));
      }
      next();
    } catch (err) {
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    // console.log("User connected:", socket.user.id);

    // Join vào các room dựa trên conversation
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
      // console.log(`User ${socket.user.id} joined conversation ${conversationId}`);
    });

    // Gửi tin nhắn realtime
    socket.on("sendMessage", async ({ conversationId, content }) => {
      try {
        const newMsg = new Message({
          conversation: conversationId,
          sender: socket.user.id,
          content,
        });

        await newMsg.save();

        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: content,
          lastSender: socket.user.id,
        });

        const populatedMsg = await newMsg.populate("sender", "name role");

        // emit cho tất cả client trong room này
        io.to(conversationId).emit("newMessage", populatedMsg);
      } catch (err) {
        console.error("Socket sendMessage error:", err);
      }
    });

    socket.on("disconnect", () => {
      // console.log("User disconnected:", socket.user.id);
    });
  });

  ioInstance = io;
  return io;
}

module.exports = initSocket;
module.exports.getIo = () => ioInstance;
