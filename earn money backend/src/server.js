import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

// ROUTES IMPORT
import authRoutes from "./routes/authRoutes.js";
import adsRoutes from "./routes/adsRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import withdrawRoutes from "./routes/withdrawRoutes.js";

dotenv.config();

const app = express();

// ---- MIDDLEWARE ----
// Logging (dev)
app.use(morgan("dev"));

// CORS: production में FRONTEND_URL env use करें, नहीं तो '*' (dev)
const FRONTEND_URL = process.env.FRONTEND_URL || "*";
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// Simple health check
app.get("/", (req, res) => {
  res.send("Earn Money Backend Running Successfully");
});

// ---- ROUTES ----
// NOTE: authRoutes expected to define "/register" and "/login"
app.use("/auth", authRoutes);
app.use("/ads", adsRoutes);
app.use("/wallet", walletRoutes);
app.use("/admin", adminRoutes);
app.use("/withdraw", withdrawRoutes);

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// Graceful shutdown (close DB connections if needed)
const graceful = () => {
  console.log("Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    console.error("Forcing shutdown");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);

