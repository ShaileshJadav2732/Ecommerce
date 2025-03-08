import { useState } from "react";
import ProductCard from "../components/product-card";

const Search = () => {
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState("");
	const [category, setCategory] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [page, setPage] = useState(1);

	const addToCarthandler = () => {};

	const isPrevPage = true;
	const isNextPage = true;

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
						min="100"
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
						<option value="">All</option>
						<option value="">sample1</option>
						<option value="">sample2</option>
						<option value="">sample3</option>
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

				<div className="search-product-list">
					<ProductCard
						productId="bfjdwf"
						name="MACKBOOK"
						price={10000}
						stock={10}
						handler={addToCarthandler}
						photo="https://m.media-amazon.com/images/I/71eXNIDUGjL._SX679_.jpg"
					/>
				</div>
				<article>
					<button
						disabled={!isPrevPage}
						onClick={() => setPage((prevPage) => prevPage - 1)}
					>
						Prev
					</button>
					<span>
						{page} of {5}
					</span>
					<button
						disabled={!isNextPage}
						onClick={() => setPage((nextPage) => nextPage + 1)}
					>
						Next
					</button>
				</article>
			</main>
		</div>
	);
};

export default Search;
