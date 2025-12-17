import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import emotionRoutes from "./routes/emotionRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js"; 
import statisticalRoutes from "./routes/statisticalRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";  
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  req.user = { id: 1 };
  next();
});
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend API is working!" });
});
app.use("/api/auth", authRoutes);
app.use("/api/emotions", emotionRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/statistics", statisticalRoutes);
app.use("/uploads", express.static('uploads'));
app.use("/api/supports", supportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});
app.use((err, req, res, next) => {
  console.error("App Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;