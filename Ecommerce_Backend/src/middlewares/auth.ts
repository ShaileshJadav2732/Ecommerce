#!  middleware to make sure only admin can access the route
import User from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
// Fixing the error in the adminOnly middleware by checking for the presence of the user role correctly
export const adminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;
  if (!id) return next(new ErrorHandler("Please Login First", 401));

  let user = await User.findById(id);
  if (!user) return next(new ErrorHandler("Register Required", 401));

  // Correcting the error message for non-admin users
  if (user.role !== "admin") {
    return next(new ErrorHandler("You do not have admin access to this route", 403));
  }

  next();
});

// 
// export const adminOnly = TryCatch(async (req, res, next) => {
//   const { id } = req.query;
//   if (!id) return next(new ErrorHandler("Please Login First", 401));
// 
//   let user = await User.findById(id);
//   if (!user) return next(new ErrorHandler("Register Required", 401));
// 
//   if (user.role !== "admin")
//     return next(new ErrorHandler("You Admin Access This route", 401));
// 
//   next();
// });
