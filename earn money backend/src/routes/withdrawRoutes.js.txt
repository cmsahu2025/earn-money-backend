import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// USER REQUEST WITHDRAW
router.post("/request", protect, async (req, res) => {
  const { amount } = req.body;

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (user.wallet < amount)
    return res.json({ message: "Insufficient balance" });

  // Deduct from wallet
  await prisma.user.update({
    where: { id: user.id },
    data: { wallet: { decrement: amount } }
  });

  // Create withdraw request
  await prisma.withdraw.create({
    data: {
      amount,
      userId: user.id
    }
  });

  res.json({ message: "Withdraw request submitted" });
});

// ADMIN — VIEW ALL WITHDRAW REQUESTS
router.get("/all", async (req, res) => {
  const list = await prisma.withdraw.findMany({
    orderBy: { id: "desc" },
    include: { user: true }
  });

  res.json(list);
});

// ADMIN — Update status
router.post("/update", async (req, res) => {
  const { id, status } = req.body; // approved/rejected

  await prisma.withdraw.update({
    where: { id },
    data: { status }
  });

  res.json({ message: "Withdraw status updated" });
});

export default router;
