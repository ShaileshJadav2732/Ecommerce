import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
import { CartItem } from "../types/types";

type productsProps = {
	productId: string;
	photo: string;
	name: string;
	price: number;
	stock: number;
	handler: (cartItem: CartItem) => string | undefined | void;
};

const ProductCard = ({
	photo,
	name,
	price,
	productId,
	stock,
	handler,
}: productsProps) => {
	return (
		<div className="product-card">
			<img src={`${server}/${photo}`} alt={name} />
			<p>{name}</p>
			<span>₹{price}</span>

			<div>
				<button
					onClick={() =>
						handler({
							photo,
							name,
							price,
							productId,
							quantity: 1,
							stock,
						})
					}
				>
					<FaPlus />
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
