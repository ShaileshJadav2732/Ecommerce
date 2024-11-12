import express from "express";
import { errorMiddleware } from "./middlewares/error.js";
import productRoute from "./routes/product.js";
import userRoute from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import orderRoute from "./routes/order.js";
import {config} from "dotenv";
import morgan from "morgan";

config({
  path: "./.env",
})

const app = express();

app.use(express.json());
app.use(morgan("dev"));
const uri= process.env.MONGO_URI || "";
connectDB(uri);

app.get("/", (req, res) => {
  res.send("api working");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);

app.use("/uploads", express.static("uploads"));

app.use(errorMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
