import { NextFunction, Request, RequestHandler, Response } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { ControllerType } from "../types/types.js";
export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;
  res.status(err.statusCode).json({
    success: true,
    message: err.message,
  });
};

export const TryCatch = (func: ControllerType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };
};

// export const TryCatch = (func: ControllerType) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     return Promise.resolve(func(req, res, next)).catch(next);
//   };
// };