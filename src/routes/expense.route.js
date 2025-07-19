import express from "express";
import { addExpense, deleteExpense, getExpenses, updateExpense } from "../controllers/expense.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/addExpense", authMiddleware, addExpense);
router.get("/getExpenses", authMiddleware, getExpenses);
router.patch("/update-expense/:id", authMiddleware, updateExpense);
router.delete("/delete-expense/:id", authMiddleware, deleteExpense);

export default router;
