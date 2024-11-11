import express from "express";
import { errorMiddleware } from "./middlewares/error.js";
import productRoute from "./routes/products.js";
import userRoute from "./routes/user.js";
import { connectDB } from "./utils/features.js";

 const app = express();

app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  res.send("api working");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product",productRoute)

app.use("/uploads",express.static("uploads"));

app.use(errorMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
