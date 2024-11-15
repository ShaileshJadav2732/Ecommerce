import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
import { Coupon } from "../models/coupon.js";

   export const newCoupon = TryCatch(async(req,res,next)=>{
      const {coupon,amount}=req.body;

      if( !coupon || !amount){
         return next(new ErrorHandler("Please enter both coupon code and amount",400));
      }
      await Coupon.create({coupon,amount});


      return res.status(201).json({ 
         success:true,
         message:`Coupon ${coupon} Created Successfully`
      })

   })

   export const applyDiscount= TryCatch(async(req,res,next)=>{
      const {coupon}=req.query;

      const discount=await Coupon.findOne({code:coupon})
      if( !discount ){
         return next(new ErrorHandler("Inalid Coupon Code",400));
      }
     
      return res.status(201).json({ 
         success:true,
         message:discount.amount
      })

   })