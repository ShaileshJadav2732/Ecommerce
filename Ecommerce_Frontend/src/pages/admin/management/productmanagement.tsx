import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { useNavigate, useParams } from "react-router-dom";
import {
	useAllProductsQuery,
	useDeleteProductMutation,
	useProductDetailsQuery,
	useUpdateProductMutation,
} from "../../../redux/api/productApi";
import { server } from "../../../redux/store";
import { Skeleton } from "../../../components/loader";
import { responseToast } from "../../../utils/features";

const Productmanagement = () => {
	const { user } = useSelector(
		(state: { user: UserReducerInitialState }) => state.user
	);

	const params = useParams();
	// console.log("paramsId", params.id);
	const navigate = useNavigate();
	const { refetch } = useAllProductsQuery(user?._id ?? "");
	const { data, isLoading } = useProductDetailsQuery(params.id!);

	const { name, photo, price, stock, category } = data?.product || {
		_id: "",
		name: "",
		photo: "",
		price: 0,
		stock: 0,
		category: "",
	};

	const [priceUpdate, setPriceUpdate] = useState<number>(price);
	const [stockUpdate, setStockUpdate] = useState<number>(stock);
	const [nameUpdate, setNameUpdate] = useState<string>(name);
	const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
	const [photoUpdate, setPhotoUpdate] = useState<string>(photo);
	const [photoFile, setPhotoFile] = useState<File>();

	const [updateProduct] = useUpdateProductMutation();
	const [deleteProduct] = useDeleteProductMutation();
	const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const file: File | undefined = e.target.files?.[0];

		const reader: FileReader = new FileReader();

		if (file) {
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				if (typeof reader.result === "string") {
					setPhotoUpdate(reader.result);
					setPhotoFile(file);
				}
			};
		}
	};

	const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData();
		if (nameUpdate !== name) formData.set("name", nameUpdate);
		if (priceUpdate !== price) formData.set("price", priceUpdate.toString());
		if (stockUpdate !== stock) formData.set("stock", stockUpdate.toString());
		if (categoryUpdate !== category) formData.set("category", categoryUpdate);
		if (photoFile) formData.set("photo", photoFile);

		const res = await updateProduct({
			formData,
			userId: user?._id ?? "",
			productId: data?.product._id ?? "",
		});

		responseToast(res, navigate, "/admin/product");
	};

	const deleteHandler = async () => {
		const res = await deleteProduct({
			userId: user?._id ?? "",
			productId: data?.product._id ?? "",
		});
		refetch();
		responseToast(res, navigate, "/admin/product");
	};

	useEffect(() => {
		if (data) {
			setNameUpdate(data.product.name);
			setPriceUpdate(data.product.price);
			setStockUpdate(data.product.stock);
			setCategoryUpdate(data.product.category);
		}
	}, [data]);
	console.log("product", data);
	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="product-management">
				{isLoading ? (
					<Skeleton count={15} />
				) : (
					<>
						<section>
							<strong>ID - {data?.product._id}</strong>

							<img src={`${server}/${photo}`} alt="Product" />
							<p>{name}</p>
							{stock > 0 ? (
								<span className="green">{data?.product.stock} Available</span>
							) : (
								<span className="red"> Not Available</span>
							)}
							<h3>₹{data?.product.price}</h3>
						</section>
						<article>
							<button className="product-delete-btn" onClick={deleteHandler}>
								<FaTrash />
							</button>
							<form onSubmit={submitHandler}>
								<h2>Manage</h2>
								<div>
									<label>Name</label>
									<input
										type="text"
										placeholder="Name"
										value={nameUpdate}
										onChange={(e) => setNameUpdate(e.target.value)}
									/>
								</div>
								<div>
									<label>Price</label>
									<input
										type="number"
										placeholder="Price"
										value={priceUpdate}
										onChange={(e) => setPriceUpdate(Number(e.target.value))}
									/>
								</div>
								<div>
									<label>Stock</label>
									<input
										type="number"
										placeholder="Stock"
										value={stockUpdate}
										onChange={(e) => setStockUpdate(Number(e.target.value))}
									/>
								</div>

								<div>
									<label>Category</label>
									<input
										type="text"
										placeholder="eg. laptop, camera etc"
										value={categoryUpdate}
										onChange={(e) => setCategoryUpdate(e.target.value)}
									/>
								</div>

								<div>
									<label>Photo</label>
									<input type="file" onChange={changeImageHandler} />
								</div>

								{photoUpdate && <img src={photoUpdate} alt="New Image" />}
								<button type="submit">Update</button>
							</form>
						</article>
					</>
				)}
			</main>
		</div>
	);
};

export default Productmanagement;
