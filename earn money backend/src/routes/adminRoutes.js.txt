import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/generateToken.js";

const router = express.Router();
const prisma = new PrismaClient();

// ADMIN LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // आपने जो admin दिया:
  const adminEmail = "chandramanisahu250@gmail.com";
  const adminPass = "cmsahu@123";

  if (email !== adminEmail)
    return res.json({ message: "Admin not found" });

  if (password !== adminPass)
    return res.json({ message: "Wrong password" });

  return res.json({
    message: "Admin Login Successful",
    token: generateToken(0, "admin"),  // role=admin
    role: "admin"
  });
});

// GET ALL USERS (admin only)
router.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { id: "desc" }
  });

  res.json(users);
});

export default router;
