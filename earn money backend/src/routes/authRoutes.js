import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/generateToken.js";

const router = express.Router();
const prisma = new PrismaClient();

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await prisma.user.findUnique({ where: { email } });

  if (userExists) return res.json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashed }
  });

  return res.json({
    message: "User registered",
    token: generateToken(user.id, user.role)
  });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.json({ message: "No user found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ message: "Wrong password" });

  return res.json({
    message: "Login successful",
    token: generateToken(user.id, user.role),
    role: user.role
  });
});

export default router;
