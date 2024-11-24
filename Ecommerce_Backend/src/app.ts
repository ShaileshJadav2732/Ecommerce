import express from "express";
import { errorMiddleware } from "./middlewares/error.js";
import Stripe from 'stripe';

import productRoute from "./routes/product.js";
import userRoute from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import orderRoute from "./routes/order.js";
import {config} from "dotenv";
import morgan from "morgan";
import paymentRoute from "./routes/payment.js"
import statsRoute from "./routes/stats.js"
import cors from  "cors";
config({
  path: "./.env",
})

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

const uri= process.env.MONGO_URI || "";
const stripeKey= process.env.STRIPE_KEY || "";
connectDB(uri);
export const stripe = new Stripe(stripeKey);

app.get("/", (req, res) => {
  res.send("api working");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard",statsRoute)
app.use("/uploads", express.static("uploads"));

app.use(errorMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
