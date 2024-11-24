import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useLoginMutation } from "../redux/api/userApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import { auth } from "../firebase";
import { MessageResponse } from "../types/api-types";

const Login = () => {
  const [gender, setGender] = useState("male");
  const [date, setDate] = useState("");

  const [login] = useLoginMutation();

  const loginHandler = async () => {
    try {
      const providor = new GoogleAuthProvider();

      const user = (await signInWithPopup(auth, providor)).user;
      const res = await login({
        name: user.displayName !,
        email: user.email!,
        photo: user.photoURL !,
        gender,
        role: "user",
        dob: date!,
        _id: user.uid!,
      });

      if ("data" in res) {
        const responseData = res.data as MessageResponse; // Ensure it matches your API type
        toast.success(responseData.message);
      } else if ("error" in res) {
        const error = res.error as FetchBaseQueryError;
        const message =
          (error.data as MessageResponse).message ;
        toast.error(message);
      } else {
        toast.error("Unexpected error");
      }

      console.log("User Info:", user);
    } catch (error) {
      console.error("Sign-In Error:", error);
      toast.error("Sign In Failed. Please try again.");
    }
  };
  return (
    <div className="login">
      <main>
        <h1 className="heading">Login</h1>
        <div>
          <label htmlFor="">Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label htmlFor="">Date of Birth</label>
          <input
            value={date}
            type="date"
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <p>Already Signed in Once</p>
          <button onClick={loginHandler}>
            <FcGoogle />
            <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
