import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllProductsQuery } from "../../redux/api/productApi";
import { server } from "../../redux/store";
import toast from "react-hot-toast";
import { CustomeError } from "../../types/api-types";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/reducer-types";
import { Skeleton } from "../../components/loader";

interface DataType {
	photo: ReactElement;
	name: string;
	price: number;
	stock: number;
	action: ReactElement;
}

const columns: Column<DataType>[] = [
	{
		Header: "Photo",
		accessor: "photo",
	},
	{
		Header: "Name",
		accessor: "name",
	},
	{
		Header: "Price",
		accessor: "price",
	},
	{
		Header: "Stock",
		accessor: "stock",
	},
	{
		Header: "Action",
		accessor: "action",
	},
];

const Products = () => {
	const { user } = useSelector(
		(state: { user: UserReducerInitialState }) => state.user
	);
	const { data, isError, error, isLoading } = useAllProductsQuery(
		user._id ?? ""
	); //nullish coalescing operator. It provides a fallback value ("") if user?._id is null or undefined.
	console.log("users data::", data);
	const [rows, setRows] = useState<DataType[]>([]);

	if (isError) {
		const err = error as CustomeError;
		toast.error(err.data.message);
	}

	useEffect(() => {
		if (data)
			setRows(
				data.products.map((i) => ({
					photo: <img src={`${server}/${i.photo}`} />,
					name: i.name,
					price: i.price,
					stock: i.stock,
					action: (
						<Link to={`/admin/product/${i._id} key={i._id}`}>Manage</Link>
					),
				}))
			);
	}, [data]);

	const Table = TableHOC<DataType>(
		columns,
		rows,
		"dashboard-product-box",
		"Products",
		rows.length > 10
	)();

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main>{isLoading ? <Skeleton count={15} /> : Table}</main>
			<Link to="/admin/product/new" className="create-product-btn">
				<FaPlus />
			</Link>
		</div>
	);
};

export default Products;
