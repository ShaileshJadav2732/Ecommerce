import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/loader";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productApi";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";

const Home = () => {
	const { data, isLoading, isError } = useLatestProductsQuery("");

	const dispatch = useDispatch();
	const addToCartHandler = (cartItem: CartItem) => {
		if (cartItem.stock < 1) {
			return toast.error("Out of stock");
		}
		dispatch(addToCart(cartItem));
		toast.success("Added to cart", { icon: "🛒", style: { color: "black" } });
	};

	if (isError) toast.error("can not fetch the Products");
	return (
		<div className="home">
			<section></section>
			<h1>
				Latest Products
				<Link to={"/search"} className="findmore">
					More
				</Link>
			</h1>

			<main>
				{isLoading ? (
					<Skeleton width="80vw" />
				) : (
					data?.products.map((product) => (
						<ProductCard
							productId={product._id}
							key={product._id}
							name={product.name}
							price={product.price}
							stock={product.stock}
							handler={addToCartHandler}
							photo={product.photo}
						/>
					))
				)}
			</main>
		</div>
	);
};

export default Home;
