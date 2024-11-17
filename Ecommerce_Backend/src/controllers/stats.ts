import { myCache } from "./../routes/product.js";
import { TryCatch } from "../middlewares/error.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import Order from "./../models/order.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats = {};
  if (myCache.has("admin-stats"))
    stats = JSON.parse(myCache.get("admin-stats") as string);
  else {
    const today = new Date();

    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };

    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth()),
    };

    const thisMonthProductPromise = await Product.find({
      createdAt: {
        $get: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
    const lastMonthProductPromise = await Product.find({
      createdAt: {
        $get: lastMonth.start,
        $lte: lastMonth.end,
      },
    });
    const thisMonthUserPromise = await User.find({
      createdAt: {
        $get: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
    const lastMonthUserPromise = await User.find({
      createdAt: {
        $get: lastMonth.start,
        $lte: lastMonth.end,
      },
    });
    const thisMonthOrderPromise = await Order.find({
      createdAt: {
        $get: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
    const lastMonthOrderPromise = await Order.find({
      createdAt: {
        $get: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const [
      thisMonthOrder,
      thisMonthProduct,
      thisMonthUser,
      lastMonthOrder,
      lastMonthProduct,
      lastMonthUser,
    ] = await Promise.all([
      thisMonthOrderPromise,
      thisMonthProductPromise,
      thisMonthUserPromise,
      lastMonthOrderPromise,
      lastMonthProductPromise,
      lastMonthUserPromise,
    ]);
  }

  //   return res.send(200).json({
  //    success:true,
  //    stats
  //   })
});

export const getBarCharts = TryCatch(async (req, res, next) => {});

export const getPieCharts = TryCatch(async (req, res, next) => {});

export const getLineCharts = TryCatch(async (req, res, next) => {});
