import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import TableHoc from "../components/admin/TableHOC";
import { Skeleton } from "../components/loader";
import { useMyOrdersQuery } from "../redux/api/orderApi";
import { CustomeError } from "../types/api-types";
import { UserReducerInitialState } from "../types/reducer-types";
type dataType = {
	_id: string;
	amount: number;
	quantity: number;
	discount: number;
	status: ReactElement;
	action: ReactElement;
};

const column: Column<dataType>[] = [
	{
		Header: "ID",
		accessor: "_id",
	},
	{
		Header: "Amount",
		accessor: "amount",
	},
	{
		Header: "Quantity",
		accessor: "quantity",
	},
	{
		Header: "Discount",
		accessor: "discount",
	},
	{
		Header: "Status",
		accessor: "status",
	},
	{
		Header: "Action",
		accessor: "action",
	},
];
const Orders = () => {
	const { user } = useSelector(
		(state: { user: UserReducerInitialState }) => state.user
	);

	const { isLoading, data, error, isError } = useMyOrdersQuery(user?._id || "");
	const [rows, setRows] = useState<dataType[]>([]);

	if (isError) {
		const err = error as CustomeError;
		toast.error(err.data.message);
	}

	useEffect(() => {
		if (data)
			setRows(
				data.orders.map((i) => ({
					_id: i._id,
					amount: i.total,
					discount: i.discount,
					quantity: i.orderItems.length,
					status: (
						<span
							className={
								i.status === "Processing"
									? "red"
									: i.status === "Shipped"
									? "green"
									: "purple"
							}
						>
							{" "}
							{i.status}{" "}
						</span>
					),
					action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>,
				}))
			);
	}, [data]);

	const Table = TableHoc<dataType>(
		column,
		rows,
		"dashboard-product-box",
		"Orders",
		rows.length > 6
	)();

	return (
		<div className="container">
			<h1>My Orders</h1>
			{isLoading ? <Skeleton count={15} /> : Table}
		</div>
	);
};

export default Orders;
