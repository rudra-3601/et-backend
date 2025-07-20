import Income from "../models/Income.js";
import exportToExcel from "../utils/exportToExcel.js";

const addIncome = async (req, res) => {
  const userId = req.user._id;
  const { incomeName, incomeAmount, source, description } = req.body;
  if (!incomeName || !incomeAmount || !source) {
    return res.status(400).json({ success: false, message: "Please provide all the required fields" });
  }
  try {
    const income = await Income.create({
      user: userId,
      incomeName,
      incomeAmount,
      source,
      description,
    });
    return res.status(200).json({ success: true, message: "Income added successfully", income });
  } catch (error) {
    console.error("Error adding income:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAllIncomes = async (req, res) => {
  const userId = req.user._id;
  const { page, limit, all } = req.query;
  try {
    let incomes = [];
    let totalIncome = 0;
    if (all === "true") {
      incomes = await Income.find({ user: userId }).sort({ createdAt: -1 });
      totalIncome = incomes.length;
    } else {
      const pageNumber = Math.max(parseInt(page) || 1, 1);
      const pageSize = Math.max(parseInt(limit) || 10, 1);
      const skip = (pageNumber - 1) * pageSize;

      totalIncome = await Income.countDocuments({ user: userId });
      incomes = await Income.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(pageSize);
    }
    return res.status(200).json({
      success: true,
      message: incomes.length ? "Incomes fetched successfully" : "No incomes found",
      totalIncome,
      incomes,
      ...(all !== "true" && {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        totalPage: Math.ceil(totalIncome / (parseInt(limit) || 10)),
      }),
    });
  } catch (error) {}
};

const getIncomeById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const income = await Income.findOne({ user: userId, _id: id });

    if (!income) {
      return res.status(404).json({ success: false, message: "No income found for this id" });
    }
    return res.status(200).json({ success: true, message: "Income found", income });
  } catch (error) {
    console.error("Error getting income by id:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateIncome = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const updateIncome = await Income.findOneAndUpdate({ _id: id, user: userId }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updateIncome) {
      return res.status(404).json({ success: false, message: "Income not found or you are not authorized" });
    }
    return res.status(200).json({ success: true, message: "Income updated successfully", income: updateIncome });
  } catch (error) {
    console.error("Error in updateIncome:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteIncome = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const deleteIncome = await Income.findOneAndDelete({ _id: id, user: userId });
    if (!deleteIncome) {
      return res.status(404).json({ success: false, message: "Income not found or you are not authorized" });
    }
    return res.status(200).json({ success: true, message: "Income deleted successfully" });
  } catch (error) {
    console.error("Error in deleteIncome:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const exportIncomesToExcel = async (req, res) => {
  const userId = req.user._id;

  try {
    const incomes = await Income.find({ user: userId }).sort({ createdAt: -1 });
    if (!incomes.length) {
      return res.status(404).json({
        success: false,
        message: "No incomes found",
      });
    }

    const incomeData = incomes.map((income) => ({
      ID: income._id.toString(),
      Name: income.incomeName,
      Amount: income.incomeAmount,
      Source: income.source,
      Description: income.description,
      Date: income.createdAt.toISOString().split("T")[0],
    }));

    return exportToExcel(incomeData, "Incomes", "incomes.xlsx", res);
  } catch (error) {
    console.error("Error in exportIncomesToExcel:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { addIncome, getAllIncomes, getIncomeById, updateIncome, deleteIncome, exportIncomesToExcel };
