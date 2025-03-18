import {
	Elements,
	PaymentElement,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { NewOrderRequest } from "../types/api-types";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useNewOrderMutation } from "../redux/api/orderApi";
import { resetCart } from "../redux/reducer/cartReducer";
import { responseToast } from "../utils/features";

// Load your Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY as string);

const CheckOutForm = () => {
	const stripe = useStripe();
	const elements = useElements();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { user } = useSelector((state: RootState) => state.user);

	const {
		shippingInfo,
		cartItems,
		subtotal,
		tax,
		discount,
		shippingCharges,
		total,
	} = useSelector((state: RootState) => state.cartReducer);

	const [isProcessing, setIsProcessing] = useState(false);
	const [newOrder] = useNewOrderMutation();

	const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		setIsProcessing(true);

		const orderData: NewOrderRequest = {
			shippingInfo,
			cartItems,
			subtotal,
			tax,
			discount,
			shippingCharges,
			total,
			user: user?._id || "",
		};
		try {
			const { paymentIntent, error } = await stripe.confirmPayment({
				elements,
				confirmParams: { return_url: window.location.origin },
				redirect: "if_required",
			});

			if (error) {
				setIsProcessing(false);
				toast.error(error.message || "Something went wrong");
				return;
			}

			if (paymentIntent.status === "succeeded") {
				const res = await newOrder(orderData);
				dispatch(resetCart());
				responseToast(res, navigate, "/order");
			}
		} catch (error) {
			console.error(error);
			toast.error("An unexpected error occurred");
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<div className="checkout-container">
			<form onSubmit={submitHandler}>
				<PaymentElement />
				<button type="submit" disabled={isProcessing || !stripe || !elements}>
					{isProcessing ? "Processing..." : "Pay"}
				</button>
			</form>
		</div>
	);
};

const Checkout = () => {
	const location = useLocation();
	const clientSecret: string | undefined = location.state;

	// Redirect to shipping if no clientSecret is provided
	if (!clientSecret) {
		return <Navigate to="/shipping" />;
	}

	return (
		<div>
			<Elements
				key={clientSecret} // Ensure Elements re-renders when clientSecret changes
				options={{
					clientSecret,
				}}
				stripe={stripePromise}
			>
				<CheckOutForm />
			</Elements>
		</div>
	);
};

export default Checkout;
