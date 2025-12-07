import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// WATCH AD → ADD REWARD
router.post("/watch", protect, async (req, res) => {
  const { reward } = req.body;   // Comes from frontend: 1, 2, or 5

  if (!reward) return res.json({ message: "Reward missing" });

  // 1. Add Transaction
  await prisma.transaction.create({
    data: {
      amount: reward,
      type: "credit",
      userId: req.user.id
    }
  });

  // 2. Update User Wallet
  await prisma.user.update({
    where: { id: req.user.id },
    data: {
      wallet: { increment: reward }
    }
  });

  // 3. Save Ad Watch History
  await prisma.watchHistory.create({
    data: {
      reward,
      userId: req.user.id
    }
  });

  res.json({
    message: "Reward added successfully",
    reward
  });
});

export default router;
