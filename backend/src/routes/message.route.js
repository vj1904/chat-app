import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/users", protectedRoute, getUsersForSidebar);
router.get("/:id", protectedRoute, getMessages);
router.get("/send/:id", protectedRoute, sendMessage);

export default router;
