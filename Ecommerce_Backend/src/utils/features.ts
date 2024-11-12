import mongoose from "mongoose";
import { myCache } from "../routes/products.js";
import { invalidateCacheType } from "../types/types.js";
import Product from "../models/products.js";
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

export const invalidateCache = async ({
  admin,
  order,
  product,
}: invalidateCacheType) => {
  if (product) {
    const productKeys: string[] = ["latest - products", "categories"];
    const products = await Product.find({}).select("_id");
    products.forEach((element) => productKeys.push(`product-${element._id}`));
    myCache.del(productKeys);
  }
  if(order){

  }
  if(admin){
    
  }
};
