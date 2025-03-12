import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItemCard from "../components/cart-item";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import { addToCart, removeCartItem } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";

const Cart = () => {
	const { cartItems, subtotal, tax, total, shippingCharges, discount } =
		useSelector(
			(state: { cartReducer: CartReducerInitialState }) => state.cartReducer
		);

	const [cuponCode, setCuponCode] = useState<string>("");
	const [isCuponValid, setIsCuponValid] = useState<boolean>(true);

	const dispatch = useDispatch();

	const incrementHandler = (cartItem: CartItem) => {
		if (cartItem.quantity >= cartItem.stock) return;
		dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
	};
	const decrementHandler = (cartItem: CartItem) => {
		if (cartItem.quantity <= 1) return;
		dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
	};
	const removeHandler = (productId: string) => {
		dispatch(removeCartItem(productId));
	};

	useEffect(() => {
		const timeOutId = setTimeout(() => {
			// Simulate checking the coupon code against a list of valid codes
			const validCodes = ["SAVE10", "20OFF", "FREESHIP"];
			if (validCodes.includes(cuponCode.toUpperCase())) {
				setIsCuponValid(true);
			} else {
				setIsCuponValid(false);
			}
		}, 1000);

		return () => {
			clearTimeout(timeOutId);
		};
	}, [cuponCode]);

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
					<p>No items Added</p>
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
					<b>Total : ₹{total - discount}</b>
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
