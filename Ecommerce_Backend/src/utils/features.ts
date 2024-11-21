import mongoose from "mongoose";
import Product from "../models/product.js";
import { myCache } from "../routes/product.js";
import { invalidateCacheType, orderItem } from "../types/types.js";
import ErrorHandler from "./utility-class.js";
export const connectDB = (uri: string) => {
  try {
    mongoose
      .connect(uri, {
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
  userId,
  orderId,
  productId,
}: invalidateCacheType) => {
  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "categories",
      "all-products",
      `product-${productId}`,
    ];
    if (typeof productId === "string") productKeys.push(`product-${productId}`);

    if (typeof productId === "object")
      productId.forEach((i) => productKeys.push(`product-${i}`));

    myCache.del(productKeys);
  }
  if (order) {
    const orderKeys: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `order-${orderId}`,
    ];
    myCache.del(orderKeys);
  }
  if (admin) {
  }
};

export const ReduceStock = async (orderItems: orderItem[]) => {
  orderItems.forEach(async (item) => {
    const product = await Product.findById(item.productId);
    if (!product) throw new ErrorHandler("Product not found", 404);
    if (product) {
      product.stock -= item.quantity;
      await product.save();
    }
  });
};

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return 100;
  const percent = ((thisMonth - lastMonth) / lastMonth) * 100;
  return percent.toFixed(0);
};

export const getInventories = async ({
  categories,
  productsCount,
}: {
  categories: string[];
  productsCount: number;
}) => {
  const categoriesCountPromise = categories.map((category) =>
    Product.countDocuments({ category })
  );

  const categoriesCount = await Promise.all(categoriesCountPromise);

  const categoryCount: Record<string, number>[] = [];

  categories.forEach((category, i) => {
    categoryCount.push({
      [category]: Math.round((categoriesCount[i] / productsCount) * 100),
    });
  });

  return categoryCount;
};