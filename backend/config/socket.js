const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const conversationController = require("../controllers/conversationController");

let ioInstance = null;

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = {
        id: decoded.userId || decoded.id,
        role: decoded.role,
        fullName: decoded.fullName || decoded.name,
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
    socket.on("joinConversation", (conversationId) => {
      if (!conversationId) return;
      socket.join(String(conversationId));
    });

    socket.on("leaveConversation", (conversationId) => {
      if (!conversationId) return;
      socket.leave(String(conversationId));
    });

    socket.on("sendMessage", async ({ conversationId, content }) => {
      try {
        if (!conversationId || !content) return;

        const newMsg = new Message({
          conversation: conversationId,
          sender: socket.user.id,
          content,
        });

        const saved = await newMsg.save();

        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: content,
          lastSender: socket.user.id,
          updatedAt: Date.now(),
        });
        const populatedMsg = await Message.findById(saved._id)
          .populate("sender", "_id fullName name avatar role");
        io.to(String(conversationId)).emit("newMessage", populatedMsg);
        try {
          conversationController.emitConversationUpdate(conversationId);
        } catch (e) {
          console.error("emitConversationUpdate error:", e);
        }
      } catch (err) {
        console.error("Socket sendMessage error:", err);
      }
    });

    socket.on("disconnect", () => {
    });
  });

  ioInstance = io;
  return io;
}

module.exports = initSocket;
module.exports.getIo = () => ioInstance;
