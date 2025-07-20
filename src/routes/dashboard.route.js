import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import { dashboardSummary } from "../controllers/dashboard.controller.js";


const router = express.Router();

router.use(authMiddleware);
router.get("/summary", authMiddleware, dashboardSummary);

export default router;