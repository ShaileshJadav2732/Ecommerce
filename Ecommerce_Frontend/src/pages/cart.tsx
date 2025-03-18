import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItemCard from "../components/cart-item";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import {
	addToCart,
	discountApplied,
	removeCartItem,
} from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import { toast } from "react-hot-toast";
import axios from "axios";
import { server } from "../redux/store";

const Cart = () => {
	const { cartItems, subtotal, tax, total, shippingCharges, discount } =
		useSelector(
			(state: { cartReducer: CartReducerInitialState }) => state.cartReducer
		);

	const [cuponCode, setCuponCode] = useState<string>("");
	const [isCuponValid, setIsCuponValid] = useState<boolean>(true);

	const dispatch = useDispatch();

	const incrementHandler = (cartItems: CartItem) => {
		if (cartItems.quantity >= cartItems.stock)
			return toast.error("Cannot add more stock");
		dispatch(addToCart({ ...cartItems, quantity: cartItems.quantity + 1 }));
	};
	const decrementHandler = (cartItems: CartItem) => {
		if (cartItems.quantity <= 1) return;
		dispatch(addToCart({ ...cartItems, quantity: cartItems.quantity - 1 }));
	};
	const removeHandler = (productId: string) => {
		dispatch(removeCartItem(productId));
	};

	useEffect(() => {
		const { token: cancelToken, cancel } = axios.CancelToken.source();

		const timeOutId = setTimeout(() => {
			axios
				.get(`${server}/api/v1/payment/discount?coupon=${cuponCode}`, {
					cancelToken,
				})
				.then((res) => {
					dispatch(discountApplied(res.data.message));

					setIsCuponValid(true);
				})
				.catch(() => {
					dispatch(discountApplied(0));
					setIsCuponValid(false);
				});
		}, 1000);

		return () => {
			clearTimeout(timeOutId);
			cancel();
			setIsCuponValid(false);
		};
	}, [cuponCode, dispatch]);

	return (
		<div className="cart">
			<main>
				{cartItems.length > 0 ? (
					cartItems.map((item, idx) => (
						<CartItemCard
							key={idx}
							cartItem={item}
							incrementHandler={incrementHandler}
							decrementHandler={decrementHandler}
							removeHandler={removeHandler}
						/>
					))
				) : (
					<h1>No items Added</h1>
				)}
			</main>
			<aside>
				<p>Subtotal: ₹{subtotal}</p>
				<p>Shipping Charges: ₹{shippingCharges}</p>
				<p>Tax: ₹{tax}</p>
				<p>
					Discount: -<em className="red">₹{discount}</em>
				</p>
				<p>
					<b>Total : ₹{total}</b>
				</p>
				<input
					type="text"
					value={cuponCode}
					onChange={(e) => setCuponCode(e.target.value)}
					placeholder="Enter cupon code"
				/>
				{cuponCode &&
					(isCuponValid ? (
						<span className="green">
							₹{discount} off using the <code>{cuponCode}</code>
						</span>
					) : (
						<span className="red">
							Invalid cupon <VscError />
						</span>
					))}
				{cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
			</aside>
		</div>
	);
};

export default Cart;
