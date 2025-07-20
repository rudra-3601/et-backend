import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Budget Manager API",
    description: "Welcome! Below are all available API endpoints:",
    routes: {
      Auth: {
        Register: "POST /api/auth/register",
        Login: "POST /api/auth/login",
        GetUserInfo: "GET /api/auth/getUserInfo (requires token)",
      },
      Budget: {
        GetAll: "GET /api/budget (requires token)",
        Add: "POST /api/budget (requires token)",
        Export: "GET /api/budget/export (requires token)",
        GetCurrent: "GET /api/budget/current (requires token)",
        GetById: "GET /api/budget/:id (requires token)",
        UpdateById: "PATCH /api/budget/:id (requires token)",
        DeleteById: "DELETE /api/budget/:id (requires token)",
      },
      Expense: {
        GetAll: "GET /api/expense (requires token)",
        Add: "POST /api/expense (requires token)",
        Export: "GET /api/expense/export (requires token)",
        UpdateById: "PATCH /api/expense/:id (requires token)",
        DeleteById: "DELETE /api/expense/:id (requires token)",
      },
      Income: {
        GetAll: "GET /api/income (requires token)",
        Add: "POST /api/income (requires token)",
        Export: "GET /api/income/export (requires token)",
        GetById: "GET /api/income/:id (requires token)",
        UpdateById: "PUT /api/income/:id (requires token)",
        DeleteById: "DELETE /api/income/:id (requires token)",
      },
      Dashboard: {
        Summary: "GET /api/dashboard/summary (requires token)",
      },
    },
    note: "All routes except /auth/register and /auth/login require authentication using Bearer Token.",
  });
});

export default router;
