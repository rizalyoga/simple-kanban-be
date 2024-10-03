import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtUtils";

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, password_confirmation } = req.body;

    if (password !== password_confirmation) {
      return res.status(400).json({
        status_code: 400,
        message: "Passwords and confirmation passwords do not match",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ status_code: 400, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      status_code: 201,
      message: "User registered successfully",
      data: { user_id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ status_code: 500, message: "Error registering user" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ status_code: 401, message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status_code: 401, message: "Invalid credentials" });
    }

    // Generate JWT
    const token = generateToken(user);

    res.status(200).json({
      status_code: 200,
      message: "Login successful",
      data: {
        user_id: user.id,
        name: user.name,
        email: user.email,
        jwt: token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ status_code: 500, message: "Error logging in" });
  }
};
