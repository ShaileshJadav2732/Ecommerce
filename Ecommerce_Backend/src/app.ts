import express from "express";
import { connectDB } from "./utils/features.js";
import userRouter from "./routes/user.js";
import { errorMiddleware } from "./middlewares/error.js";


 const app = express();

app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  res.send("api working");
});

app.use("/api/v1/user", userRouter);

app.use(errorMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
