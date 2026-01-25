import { Router } from "express";
import { authCallback, getMe } from "../controllers/authController";
import { protectedRoute } from "../middlewares/auth";

const router = Router();

// GET /api/auth/me
router.get("/me", protectedRoute, getMe)
// POST /api/auth/callback
router.post("/callback", authCallback)

export default router;