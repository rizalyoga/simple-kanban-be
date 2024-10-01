import express from "express";
import { registerUser, loginUser } from "../controllers/userController";
import { validateRegistration, validateLogin } from "../middleware/validation";

const router = express.Router();

router.post("/signup", validateRegistration, registerUser);
router.post("/login", validateLogin, loginUser);

export default router;
