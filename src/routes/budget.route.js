import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import {
  addBudget,
  deleteBudget,
  getAllBudgets,
  getBudgetById,
  getCurrentBudget,
  updateBudget,
} from "../controllers/budget.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", addBudget);
router.get("/", getAllBudgets);
router.get("/current", getCurrentBudget);
router.get("/:id", getBudgetById);
router.patch("/:id", updateBudget);
router.delete("/:id", deleteBudget);

export default router;
