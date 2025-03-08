import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productApi";

const Home = () => {
	// eslint-disable-next-line no-empty-pattern
	const { data } = useLatestProductsQuery("");

	const addToCarthandler = () => {};
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
				{data?.products.map((product) => (
					<ProductCard
						productId={product._id}
						key={product._id}
						name={product.name}
						price={product.price}
						stock={product.stock}
						handler={addToCarthandler}
						photo={product.photo}
					/>
				))}
			</main>
		</div>
	);
};

export default Home;
