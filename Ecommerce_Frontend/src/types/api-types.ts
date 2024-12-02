import { User } from "./types";

export type MessageResponse={

   success:boolean,
   message:string
}
export type UserResponse={
   user:User;
   success:boolean,
   message:string
   
}