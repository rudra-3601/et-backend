import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import connectDB from "./config/db.js";
import expenseRoute from "./routes/expense.route.js";
import budgetRoute from "./routes/budget.route.js";
import incomeRoute from "./routes/income.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import homeRoute from "./routes/home.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connectDB();

const port = process.env.PORT || 5000;


app.use("/", homeRoute);
app.use("/api/auth", authRoute);
app.use("/api/expense", expenseRoute);
app.use("/api/budget", budgetRoute);
app.use("/api/income", incomeRoute);
app.use("/api/dashboard", dashboardRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
