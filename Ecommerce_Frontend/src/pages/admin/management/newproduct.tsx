import { ChangeEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { useNewProductMutation } from "../../../redux/api/productApi";

const NewProduct = () => {
	const { user, loading } = useSelector(
		(state: { user: UserReducerInitialState }) => state.user
	);

	const [name, setName] = useState<string>("");
	const [category, setCategory] = useState<string>("");
	const [price, setPrice] = useState<number>(1000);
	const [stock, setStock] = useState<number>(1);
	const [photoPrev, setPhotoPrev] = useState<string>("");
	const [photo, setPhoto] = useState<File>();

	const [newProduct] = useNewProductMutation();

	const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const file: File | undefined = e.target.files?.[0];

		const reader: FileReader = new FileReader();

		if (file) {
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				if (typeof reader.result === "string") {
					setPhotoPrev(reader.result);
					setPhoto(file);
				}
			};
		}
	};

	const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!photo || !name || !category || !price || !stock) {
			return;
		}

		const formData = new FormData();
		formData.append("name", name);
		formData.append("price", String(price));
		formData.append("stock", String(stock));
		formData.append("category", category);
		formData.append("photo", photo);

		const response = await newProduct({
			formData,
			id: user?._id ?? "",
		}).unwrap();

		if (response.success) {
			alert("Product created successfully");
			setName("");
			setPrice(1000);
			setStock(1);
			setCategory("");
			setPhotoPrev("");
		} else {
			alert("Failed to create product");
		}
	};
	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="product-management">
				<article>
					<form onSubmit={submitHandler}>
						<h2>New Product</h2>
						<div>
							<label>Name</label>
							<input
								type="text"
								placeholder="Name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div>
							<label>Price</label>
							<input
								required
								type="number"
								placeholder="Price"
								value={price}
								onChange={(e) => setPrice(Number(e.target.value))}
							/>
						</div>
						<div>
							<label>Stock</label>
							<input
								required
								type="number"
								placeholder="Stock"
								value={stock}
								onChange={(e) => setStock(Number(e.target.value))}
							/>
						</div>

						<div>
							<label>Category</label>
							<input
								required
								type="text"
								placeholder="eg. laptop, camera etc"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
							/>
						</div>

						<div>
							<label>Photo</label>
							<input type="file" required onChange={changeImageHandler} />
						</div>

						{photoPrev && <img src={photoPrev} alt="New Image" />}
						<button type="submit">Create</button>
					</form>
				</article>
			</main>
		</div>
	);
};

export default NewProduct;
