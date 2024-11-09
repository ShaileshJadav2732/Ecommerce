import mongoose from "mongoose";

export const connectDB = () => {
  try {
    mongoose
      .connect(process.env.MONGO_URI || "mongodb://localhost:27017", {
        dbName: "Ecommerce",
      })
      .then((c) => console.log(`Db connected to ${c.connection.host}`))
      .catch((e) => {
        console.log(e);
      });
  } catch (error) {
    console.log(error);
  }
};
