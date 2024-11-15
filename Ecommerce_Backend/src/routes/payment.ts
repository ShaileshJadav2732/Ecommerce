import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { newCoupon ,applyDiscount} from "../controllers/payment.js";

 const app=express();

 app.post("/coupon/new",adminOnly,newCoupon);
 app.get("/discount",applyDiscount)

 export default app;