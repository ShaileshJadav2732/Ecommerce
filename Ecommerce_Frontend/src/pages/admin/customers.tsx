import { ReactElement, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
	useAllUsersQuery,
	useDeleteUserMutation,
} from "../../redux/api/userApi";
import { CustomeError } from "../../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/loader";

interface DataType {
	avatar: ReactElement;
	name: string;
	email: string;
	gender: string;
	role: string;
	action: ReactElement;
}

const columns: Column<DataType>[] = [
	{
		Header: "Avatar",
		accessor: "avatar",
	},
	{
		Header: "Name",
		accessor: "name",
	},
	{
		Header: "Gender",
		accessor: "gender",
	},
	{
		Header: "Email",
		accessor: "email",
	},
	{
		Header: "Role",
		accessor: "role",
	},
	{
		Header: "Action",
		accessor: "action",
	},
];

const Customers = () => {
	const { user } = useSelector((state: RootState) => state.user);

	const { data, isError, error, isLoading } = useAllUsersQuery(user?._id || "");

	const [rows, setRows] = useState<DataType[]>([]);

	const [deleteUser] = useDeleteUserMutation();

	const deleteHandler = async (userId: string) => {
		await deleteUser({ userId, adminUserId: user?._id ?? "" });
		toast.success("User deleted successfully");
	};

	if (isError) {
		const err = error as CustomeError;
		toast.error(err.data.message);
	}

	useEffect(() => {
		if (data)
			setRows(
				data.users.map((user) => ({
					avatar: (
						<img
							src={user.photo}
							alt={user.name}
							style={{ borderRadius: 50 }}
						/>
					),
					name: user.name,
					email: user.email,
					role: user.role,
					gender: user.gender,
					action: (
						<button
							className="btn btn-danger"
							onClick={() => deleteHandler(user._id)}
						>
							<FaTrash />
						</button>
					),
				}))
			);
	}, [data]);

	const Table = TableHOC<DataType>(
		columns,
		rows,
		"dashboard-product-box",
		"Customers",
		rows.length > 6
	)();

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main>{isLoading ? <Skeleton count={15} /> : Table}</main>
		</div>
	);
};

export default Customers;
