import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import toast from "react-hot-toast";
import { auth } from '../firebase';

const Login = () => {
  const [gender, setGender] = useState("male");
  const [date, setDate] = useState("");

  const loginHandler=async()=>{

    try {
      const providor = new GoogleAuthProvider();

      const user = (await signInWithPopup(auth, providor)).user;

      console.log("User Info:", user);
    } catch (error) {
      console.error("Sign-In Error:", error);
      toast.error("Sign In Failed. Please try again.");
    }
  }
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
          <input value={date} type="date" onChange={(e) => setDate(e.target.value)}/>
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
