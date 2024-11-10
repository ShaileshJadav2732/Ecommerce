import { NextFunction, Request, Response } from "express";
import User from "../models/user.js";
import { newUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";

export const newUser =  TryCatch(
   async(
    req: Request<{}, {}, newUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
  //  throw new Error("abcd ewrrro");
    const { name, email, dob, photo, gender, _id } = req.body;
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
   
  }
);
