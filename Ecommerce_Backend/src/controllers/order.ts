import { TryCatch } from "../middlewares/error.js";
import Order from "../models/order.js";
import { NewOrderRequestBody } from "../types/types.js";
import { NextFunction, Request } from "express";
import { invalidateCache, ReduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
export const newOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      orderItems,
      subTotal,
      user,
      tax,
      shippingCharges,
      total,
      discount,
    } = req.body;

   if (
  !shippingInfo || 
  !shippingInfo.address ||
  !shippingInfo.city ||
  !shippingInfo.state ||
  !shippingInfo.country ||
  !shippingInfo.pinCode ||
  !orderItems ||
  !subTotal ||
   !user ||
   !tax ||
  !shippingCharges ||
  !total ||
  !discount
)
       return next(new ErrorHandler("All fields are required", 400));

    await Order.create({
      shippingInfo,
      orderItems,
      subTotal,
      tax,
      shippingCharges,
      total,
      user,
      discount
    });
   
    await ReduceStock(orderItems);
    invalidateCache({ product: true, order: true, admin: true });
 return res.status(201).json({
      success: true,
      message: "Order created successfully",
    });
  }
);





