import express from "express";
import {
  addExpense,
  deleteExpense,
  exportExpensesToExcel,
  getExpenses,
  updateExpense,
} from "../controllers/expense.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", addExpense);
router.get("/", getExpenses);
router.get("/export", exportExpensesToExcel);
router.patch("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
