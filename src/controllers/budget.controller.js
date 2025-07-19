import Budget from "../models/Budget.js";
const addBudget = async (req, res) => {
  const { amount, month, year } = req.body;
  const userId = req.user._id;
  if (!amount || !month || !year) {
    return res.status(400).json({ success: false, message: "Please provide all the required fields" });
  }
  try {
    const budget = await Budget.findOneAndUpdate(
      { user: userId, month, year },
      { $set: { amount } },
      { upsert: true, new: true }
    );
    return res.status(200).json({ success: true, message: "Budget added successfully", budget });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAllBudgets = async (req, res) => {
  const userId = req.user._id;
  const { page, limit, all } = req.query;

  try {
    let budgets = [];
    let totalBudget = 0;

    if (all === "true") {
      budgets = await Budget.find({ user: userId }).sort({ createdAt: -1 });
      totalBudget = budgets.length;
    } else {
      const pageNumber = Math.max(parseInt(page) || 1, 1);
      const pageSize = Math.max(parseInt(limit) || 10, 1);
      const skip = (pageNumber - 1) * pageSize;

      totalBudget = await Budget.countDocuments({ user: userId });

      budgets = await Budget.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(pageSize);
    }

    return res.status(200).json({
      success: true,
      message: budgets.length ? "Budgets fetched successfully" : "No budgets found",
      totalBudget,
      budgets,
      ...(all !== "true" && {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        totalPage: Math.ceil(totalBudget / (parseInt(limit) || 10)),
      }),
    });
  } catch (error) {
    console.error("Error getting budgets:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getCurrentBudget = async (req, res) => {
  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();

  const userId = req.user.id;
  try {
    const budget = await Budget.findOne({ user: userId, month: month, year: year });
    if (!budget) {
      return res.status(404).json({ success: false, message: "No budget found for this month" });
    }
    return res.status(200).json({ success: true, message: "Budget found", budget });
  } catch (error) {
    console.error("Error getting current budget:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getBudgetById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const budget = await Budget.findOne({ user: userId, _id: id });
    if (!budget) {
      return res.status(404).json({ success: false, message: "No budget found for this id" });
    }
    return res.status(200).json({ success: true, message: "Budget found", budget });
  } catch (error) {
    console.error("Error getting budget by id:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const updateBudget = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const updateBudget = await Budget.findOneAndUpdate({ _id: id, user: userId }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updateBudget) {
      return res.status(404).json({ success: false, message: "Budget not found or you are not authorized" });
    }
    return res.status(200).json({ success: true, message: "Budget updated successfully", budget: updateBudget });
  } catch (error) {
    console.error("Error in updateBudget:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const deleteBudget = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const deleteBudget = await Budget.findOneAndDelete({ _id: id, user: userId });
    if (!deleteBudget) {
      return res.status(404).json({ success: false, message: "Budget not found or you are not authorized" });
    }
    return res.status(200).json({ success: true, message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Error in deleteBudget:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { addBudget, getAllBudgets, getCurrentBudget, getBudgetById, updateBudget, deleteBudget };
