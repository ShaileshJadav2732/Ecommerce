import express from "express";
import { getDashboardStats } from "../controllers/stats.js";
import { adminOnly } from "../middlewares/auth.js";
import {
  getPieCharts,
  getBarCharts,
  getLineCharts,
} from "./../controllers/stats.js";
const app = express.Router();

//api/v1/dashboard/stats
app.get("/stats", adminOnly, getDashboardStats);
app.get("/pie", adminOnly, getPieCharts);
app.get("/bar", adminOnly, getBarCharts);
app.get("/line", adminOnly, getLineCharts);

export default app;
