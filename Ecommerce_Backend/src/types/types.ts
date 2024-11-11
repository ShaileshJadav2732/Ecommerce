import { Request, Response, NextFunction } from "express";
export interface newUserRequestBody {
  name: string;
  email: string;
  dob: Date;
  _id: string;
  photo: string;
  gender:string;

} 

export type ControllerType =  (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise < void | Response<any, Record<string, any>>>;
