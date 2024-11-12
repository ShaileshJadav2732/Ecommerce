import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { newOrder } from "../controllers/order.js";
const app = express.Router();
// to create new order -/api/v1/order/new
app.post("/new",adminOnly,newOrder)

export default app;
