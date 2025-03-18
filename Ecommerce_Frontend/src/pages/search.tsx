import { useState } from "react";
import ProductCard from "../components/product-card";
import {
	useCategoriesQuery,
	useSearchProductsQuery,
} from "../redux/api/productApi";
import toast from "react-hot-toast";
import { CustomeError } from "../types/api-types";
import { Skeleton } from "../components/loader";
import { CartItem } from "../types/types";
import { addToCart } from "../redux/reducer/cartReducer";
import { useDispatch } from "react-redux";

const Search = () => {
	const dispatch = useDispatch();
	const { data: categoriesResponse, isError, error } = useCategoriesQuery("");

	const [search, setSearch] = useState("");
	const [sort, setSort] = useState("");
	const [category, setCategory] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [page, setPage] = useState(1);

	const {
		isLoading: productLoading,
		data: searchedData,
		isError: productIsError,
		error: productError,
	} = useSearchProductsQuery({
		price: Number(maxPrice),
		category,
		search,
		sort,
		page,
	});
	console.log(searchedData);

	const addToCartHandler = (cartItem: CartItem) => {
		if (cartItem.stock < 1) {
			return toast.error("Out of stock");
		}
		dispatch(addToCart(cartItem));
		toast.success("Added to cart", { icon: "🛒", style: { color: "black" } });
	};
	const isPrevPage = true;
	const isNextPage = true;

	if (isError) {
		const err = error as CustomeError;
		toast.error(err.data.message);
	}
	if (productIsError) {
		const err = productError as CustomeError;
		toast.error(err.data.message);
	}

	return (
		<div className="product-search-page">
			<aside>
				<h2></h2>
				<div>
					<h4>Sort</h4>
					<select value={sort} onChange={(e) => setSort(e.target.value)}>
						<option value="">None</option>
						<option value="asc">Price ( Low to High )</option>
						<option value="dsc">Price ( High to Low )</option>
					</select>
				</div>
				<div>
					<h4>Max Price: {maxPrice || ""}</h4>
					<input
						type="range"
						min="10   "
						max="100000"
						value={maxPrice}
						onChange={(e) => setMaxPrice(e.target.value)}
					/>
				</div>
				<div>
					<h4>Category</h4>
					<select
						value={category}
						onChange={(e) => setCategory(e.target.value)}
					>
						<option value="">ALL</option>
						{categoriesResponse?.categories.map((category) => (
							<option key={category} value={category}>
								{category.toLocaleUpperCase()}
							</option>
						))}
					</select>
				</div>
			</aside>
			<main>
				<h1>Products</h1>
				<input
					type="text"
					placeholder="search by name ..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>

				{productLoading ? (
					<Skeleton count={10} />
				) : (
					<div className="search-product-list">
						{searchedData?.products.map((product) => (
							<ProductCard
								key={product._id}
								productId={product._id}
								name={product.name}
								price={product.price}
								stock={product.stock}
								handler={addToCartHandler}
								photo={product.photo}
							/>
						))}
					</div>
				)}
				{searchedData && searchedData.totalPage > 1 && (
					<article>
						<button
							disabled={!isPrevPage}
							onClick={() => setPage((prevPage) => prevPage - 1)}
						>
							Prev
						</button>
						<span>
							{page} of {searchedData.totalPage}
						</span>
						<button
							disabled={!isNextPage}
							onClick={() => setPage((nextPage) => nextPage + 1)}
						>
							Next
						</button>
					</article>
				)}
			</main>
		</div>
	);
};

export default Search;
