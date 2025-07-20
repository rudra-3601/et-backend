import Budget from "../models/Budget.js";
import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
const dashboardSummary = async (req, res) => {
  const userId = req.user._id;
  try {
    const budgets = await Budget.find({ user: userId }).sort({ createdAt: -1 });
    const incomes = await Income.find({ user: userId }).sort({ createdAt: -1 });
    const expenses = await Expense.find({ user: userId }).sort({ createdAt: -1 });

    const totalBudget = budgets.reduce((acc, budget) => acc + budget.amount, 0);
    const totalIncome = incomes.reduce((acc, income) => acc + income.incomeAmount, 0);
    const totalExpense = expenses.reduce((acc, expense) => acc + expense.expenseAmount, 0);
    const remaining = totalBudget - totalExpense;

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const currentMonthIncome = incomes.filter(
      (income) => new Date(income.date).getMonth() === month && new Date(income.date).getFullYear() === year
    );
    const currentMonthExpense = expenses.filter(
      (expense) => new Date(expense.date).getMonth() === month && new Date(expense.date).getFullYear() === year
    );

    const totalCurrentMonthIncome = currentMonthIncome.reduce((acc, income) => acc + income.incomeAmount, 0);
    const totalCurrentMonthExpense = currentMonthExpense.reduce((acc, expense) => acc + expense.expenseAmount, 0);

    const currentMonthSavings = totalCurrentMonthIncome - totalCurrentMonthExpense;

    return res.status(200).json({
      success: true,
      message: "Dashboard summary fetched successfully",
      totalBudget,
      totalIncome,
      totalExpense,
      remaining,
      totalCurrentMonthIncome,
      totalCurrentMonthExpense,
      currentMonthSavings,
      latestIncomeAndSource: incomes[0]
        ? {
            incomeName: incomes[0].incomeName,
            source: incomes[0].source,
            amount: incomes[0].incomeAmount,
            date: incomes[0].date,
          }
        : {},
      latestExpenseAndCategory: expenses[0]
        ? {
            expenseName: expenses[0].expenseName,
            category: expenses[0].category,
            amount: expenses[0].expenseAmount,
            date: expenses[0].date,
          }
        : {},
    });
  } catch (error) {
    console.error("Error in dashboardSummary:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { dashboardSummary };
