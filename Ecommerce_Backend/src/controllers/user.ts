import { NextFunction, Request, Response } from "express";
import User from "../models/user.js";
import { newUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, newUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    //  throw new Error("abcd ewrrro");
    const { name, email, dob, photo, gender, _id } = req.body;

    let user = await User.findById(_id);

    if (user) {
      return res.status(200).json({
        success: true,
        message: `Welcome again ${user.name}`,
      });
    }

    if (!name || !email || !dob || !photo || !gender || !_id) {
      return next(new ErrorHandler("Please Enter All Fields", 400));
    }
    user = await User.create({
      name,
      email,
      dob: new Date(dob),
      photo,
      gender,
      _id,
    });

    return res.status(201).json({
      success: true,
      message: `Welcome ${user.name}`,
    });
  }
);

export const getAllUsers = TryCatch(async (req, res, next) => {
  let users = await User.find({});

  return res.status(200).json({
    success: true,
    users,
  });
});

export const getUser = TryCatch(async (req, res, next) => {
  let id = req.params.id;
  let user = await User.findById(id);
  return res.status(200).json({
    success: true,
    user,
  });
});

export const deleteUser = TryCatch(async (req, res, next) => {
  let id = req.params.id;
  let user = await User.findById(id);

  if (!user) return next(new ErrorHandler("Invalid Id", 400));
  await user.deleteOne();

  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
