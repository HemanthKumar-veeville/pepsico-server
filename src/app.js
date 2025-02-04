const express = require("express");
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const ideaRoutes = require("./routes/ideaRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const dotenv = require("dotenv");
const fileRoutes = require("./routes/fileRoutes");
dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "https://pepsico-idea-2qcc.vercel.app/",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/files", fileRoutes);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Sync database
sequelize.sync({ force: false }).then(() => {
  console.log("Database synced");
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, io };
