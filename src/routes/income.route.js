import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  addIncome,
  deleteIncome,
  exportIncomesToExcel,
  getAllIncomes,
  getIncomeById,
  updateIncome,
} from "../controllers/income.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", addIncome);
router.get("/", getAllIncomes);
router.get("/export", exportIncomesToExcel);
router.get("/:id", getIncomeById);
router.put("/:id", updateIncome);
router.delete("/:id", deleteIncome);


export default router;
