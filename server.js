const http = require("http");
const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routers/authRouter");
const contactsRouter = require("./routers/contactsRouter");
const chatRoomRouter = require("./routers/chatRoomRouter");
const profileRouter = require("./routers/profileRouter");
const uploadRouter = require("./routers/uploadRouter");
const ReqError = require("./utilities/ReqError");
const errorController = require("./controllers/errorController");
const { initSocket } = require("./socket");

// Load environment variables
dotenv.config({ path: "./.env" });

// Initialize Express app
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors());

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected..."))
  .catch((error) => console.error("Database connection error:", error));

// API Routes
app.use("/api/user", authRouter);

// Route protector middleware
app.use("/api/*", (req, res, next) => {
  const token = req.header("x-auth-token");
  console.log("token====>", token);
  if (!token) return next(new ReqError(400, "You are not logged in"));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(payload);
    req.user = payload;
    next();
  } catch (err) {
    console.log("err", err);
    return next(new ReqError(409, "Token is not valid"));
  }
});

app.use("/api/contacts", contactsRouter);
app.use("/api/profile", profileRouter);
app.use("/api/chatRoom", chatRoomRouter);
app.use("/api/upload", uploadRouter);

// Error handling middleware
app.use(errorController);

// Static file serving (Uncomment for serving client build)
// app.use(express.static(path.join(__dirname, "client", "build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "build", "index.html"));
// });

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});
initSocket(io);
app.set("io", io);

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
