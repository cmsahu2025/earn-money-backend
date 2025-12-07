import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET WALLET BALANCE
router.get("/balance", protect, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  res.json({ wallet: user.wallet });
});

// TRANSACTION HISTORY
router.get("/transactions", protect, async (req, res) => {
  const history = await prisma.transaction.findMany({
    where: { userId: req.user.id },
    orderBy: { id: "desc" }
  });

  res.json(history);
});

export default router;
