import Expense from "../models/Expense.js";
import exportToExcel from "../utils/exportToExcel.js";

const addExpense = async (req, res) => {
  const userId = req.user._id;
  const { expenseName, expenseAmount, category, date, paymentMethod, description } = req.body;

  if (!expenseName || !expenseAmount || !category || !paymentMethod) {
    return res.status(400).json({ success: false, message: "Please provide all required fields" });
  }

  try {
    const expense = await Expense.create({
      user: userId,
      expenseName,
      expenseAmount,
      category,
      date,
      paymentMethod,
      description,
    });

    return res.status(200).json({
      success: true,
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getExpenses = async (req, res) => {
  const userId = req.user._id;
  const { page, limit, all } = req.query;

  try {
    let expenses = [];
    let totalExpenses = 0;

    if (all === "true") {
      expenses = await Expense.find({ user: userId }).sort({ createdAt: -1 });
      totalExpenses = expenses.length;
    } else {
      const pageNumber = Math.max(parseInt(page) || 1, 1);
      const pageSize = Math.max(parseInt(limit) || 10, 1);
      const skip = (pageNumber - 1) * pageSize;

      totalExpenses = await Expense.countDocuments({ user: userId });

      expenses = await Expense.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(pageSize);
    }

    return res.status(200).json({
      success: true,
      message: expenses.length ? "Expenses fetched successfully" : "No expenses found",
      totalExpenses,
      expenses,
      ...(all !== "true" && {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        totalPage: Math.ceil(totalExpenses / (parseInt(limit) || 10)),
      }),
    });
  } catch (error) {
    console.error("Error getting expenses:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const updatedExpense = await Expense.findOneAndUpdate({ _id: id, user: userId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found or you are not authorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    console.error("Error in updateExpense:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const deleteExpense = await Expense.findOneAndDelete({ _id: id, user: userId });
    if (!deleteExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found or you are not authorized",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteExpense:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const exportExpensesToExcel = async (req, res) => {
  const userId = req.user._id;

  try {
    const expenses = await Expense.find({ user: userId }).sort({ createdAt: -1 });
    if (!expenses.length) {
      return res.status(404).json({
        success: false,
        message: "No expenses found",
      });
    }

    const expenseData = expenses.map((expense) => ({
      ID: expense._id.toString(),
      Title: expense.title,
      Amount: expense.amount,
      Category: expense.category,
      Description: expense.description,
      Date: expense.createdAt.toISOString().split("T")[0],
    }));

    return exportToExcel(expenseData, "Expenses", "expenses.xlsx", res);
  } catch (error) {
    console.error("Error in exportExpensesToExcel:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { addExpense, getExpenses, updateExpense, deleteExpense, exportExpensesToExcel };
