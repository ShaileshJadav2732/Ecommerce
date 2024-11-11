import mongoose from "mongoose";
import validator from "validator";

interface IUser extends Document {
  _id: string;
  name: string;
  photo: string;
  dob: Date;
  gender: "male" | "female";
  email: string;
  createdAt: Date;
  updatedAt: Date;
  age: number;
  role: "admin" | "user";
}

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Id is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      validate: validator.default.isEmail,
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
    },

    photo: {
      type: String,
      required: [true, "Photo is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Gender is required"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.virtual("age").get(function () {
  // virtual field to calculate age of user
  const today = new Date();
  const dob = this.dob;
  let age = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    today.getMonth === dob.getMonth ||
    (today.getDate() < dob.getDate() && today.getDate() < dob.getDate())
  ) {
    age--;
  }
  return age;
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
