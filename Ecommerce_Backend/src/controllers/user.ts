import { NextFunction, Request, Response } from "express";
import User from "../models/user.js";
import { newUserRequestBody } from "../types/types.js";

export const newUser = async (
  req: Request<{}, {}, newUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, dob, photo, gender, _id} = req.body;
console.log(name, email, dob, photo, gender, _id);
    const user = await User.create({
       name,
       email,
       dob: new Date(dob),
       photo,
       gender,
       _id,
     });

    res.status(201).json({
      success: true,
      message: `Welcome ${user.name}`,
    });
  } catch (error) {
   res.status(201).json({
     success: false,
     message: error,
   });
  }
};
