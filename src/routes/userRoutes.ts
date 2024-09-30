import express from "express";
import { registerUser } from "../controllers/userController";
import { validateRegistration } from "../middleware/validation";

const router = express.Router();

router.post("/register", validateRegistration, registerUser);

export default router;
