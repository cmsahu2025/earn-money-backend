import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// ROUTES IMPORT
import authRoutes from "./routes/authRoutes.js";
import adsRoutes from "./routes/adsRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import withdrawRoutes from "./routes/withdrawRoutes.js";

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// DEFAULT ROUTE
app.get("/", (req, res) => {
  res.send("Earn Money Backend Running Successfully");
});

// API ROUTES
app.use("/auth", authRoutes);
app.use("/ads", adsRoutes);
app.use("/wallet", walletRoutes);
app.use("/admin", adminRoutes);
app.use("/withdraw", withdrawRoutes);

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
