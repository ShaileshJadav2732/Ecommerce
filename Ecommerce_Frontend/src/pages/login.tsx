import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useLoginMutation } from "../redux/api/userApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import { auth } from "../firebase";
import { MessageResponse } from "../types/api-types";

import { useNavigate } from "react-router-dom";
const Login = () => {
	const navigate = useNavigate();
	const [gender, setGender] = useState("male");
	const [date, setDate] = useState("");

	const [login] = useLoginMutation();

	const loginHandler = async () => {
		try {
			const provider = new GoogleAuthProvider();

			// Step 1: Sign in with Google
			const result = await signInWithPopup(auth, provider);
			const user = result.user;

			// Step 2: Get the ID token
			const idToken = await user.getIdToken();
			console.log("ID Token:", idToken);

			// Step 3: Set the token in a cookie
			document.cookie = `firebaseToken=${idToken}; path=/; max-age=${
				3600 * 24
			}; Secure; SameSite=Strict`;

			// Step 4: Send user data to the backend
			const res = await login({
				name: user.displayName || "",
				email: user.email || "",
				photo: user.photoURL || "",
				gender,
				role: "user",
				dob: date,
				_id: user.uid,
			});

			// Step 5: Handle the response
			if ("data" in res) {
				const responseData = res.data as MessageResponse;
				toast.success(responseData.message);
				navigate("/");
			} else if ("error" in res) {
				const error = res as FetchBaseQueryError;
				const message = (error.data as MessageResponse).message;
				toast.error(message);
				console.log(message);
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
