import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { server } from "../redux/store";
import { CartItem as CartItems } from "../types/types";

type CartItemProps = {
	cartItem: CartItems;
	incrementHandler: (cartItem: CartItems) => void;
	decrementHandler: (cartItem: CartItems) => void;
	removeHandler: (id: string) => void;
};
const CartItemCard = ({
	cartItem,
	incrementHandler,
	decrementHandler,
	removeHandler,
}: CartItemProps) => {
	const { productId, photo, name, price, quantity } = cartItem;
	return (
		<div className="cart-item">
			<img src={`${server}/${photo}`} alt={name} />
			<article>
				<Link to={`/product/${productId}`}>{name} </Link>
				<span>₹{price}</span>
			</article>
			<div>
				<button onClick={() => decrementHandler(cartItem)}>-</button>
				<p>{quantity}</p>
				<button onClick={() => incrementHandler(cartItem)}>+</button>
			</div>
			<button
				onClick={() => removeHandler(productId)}
				className="cart-delete-btn"
			>
				<FaTrash />
			</button>
		</div>
	);
};

export default CartItemCard;
