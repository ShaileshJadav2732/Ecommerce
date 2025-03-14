import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/loader";
import {
	useDeleteOrderMutation,
	useOrderdDetailsQuery,
	useUpdateOrderMutation,
} from "../../../redux/api/orderApi";
import { server } from "../../../redux/store";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { OrderItem } from "../../../types/types";
import { responseToast } from "../../../utils/features";

const defaultData = {
	shippingInfo: {
		address: "",
		city: "",
		state: "",
		country: "",
		pinCode: "",
	},
	name: "",

	status: "",
	subtotal: 0,
	discount: 0,
	shippingCharges: 0,
	tax: 0,
	total: 0,
	orderItems: [],
	user: { name: "", _id: "" },
	_id: "",
};

const TransactionManagement = () => {
	const { user } = useSelector(
		(state: { user: UserReducerInitialState }) => state.user
	);

	const params = useParams();
	const navigate = useNavigate();

	const { isLoading, data, isError } = useOrderdDetailsQuery(params.id!);

	const {
		shippingInfo: { address, city, state, country, pinCode },
		orderItems,
		user: { name },
		status,
		subtotal,
		total,
		discount,
		shippingCharges,
		tax,
	} = data?.order || defaultData;

	const [updateOrder] = useUpdateOrderMutation();
	const [deleteOrder] = useDeleteOrderMutation();

	const updateHandler = async () => {
		const res = await updateOrder({
			userId: user?._id ?? "",
			orderId: data?.order._id ?? "",
		});
		responseToast(res, navigate, "/admin/transaction");
	};
	const deleteHandler = async () => {
		const res = await deleteOrder({
			userId: user?._id ?? "",
			orderId: data?.order._id ?? "",
		});
		responseToast(res, navigate, "/admin/transaction");
	};

	if (isError) {
		return <Navigate to={"/404"} />;
	}
	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="product-management">
				{isLoading ? (
					<Skeleton />
				) : (
					<>
						<section
							style={{
								padding: "2rem",
							}}
						>
							<h2>Order Items</h2>

							{orderItems.map((i) => (
								<ProductCard
									key={i._id}
									name={i.name}
									photo={`${server}/${i.photo}`}
									productId={i.productId}
									_id={i._id}
									quantity={i.quantity}
									price={i.price}
								/>
							))}
						</section>

						<article className="shipping-info-card">
							<button className="product-delete-btn" onClick={deleteHandler}>
								<FaTrash />
							</button>
							<h1>Order Info</h1>
							<h5>User Info</h5>
							<p>Name: {name}</p>
							<p>
								Address:{" "}
								{`${address}, ${city}, ${state}, ${country} ${pinCode}`}
							</p>
							<h5>Amount Info</h5>
							<p>Subtotal: {subtotal}</p>
							<p>Shipping Charges: {shippingCharges}</p>
							<p>Tax: {tax}</p>
							<p>Discount: {discount}</p>
							<p>Total: {total}</p>

							<h5>Status Info</h5>
							<p>
								Status:{" "}
								<span
									className={
										status === "Delivered"
											? "purple"
											: status === "Shipped"
											? "green"
											: "red"
									}
								>
									{status}
								</span>
							</p>
							<button className="shipping-btn" onClick={updateHandler}>
								Process Status
							</button>
						</article>
					</>
				)}
			</main>
		</div>
	);
};

const ProductCard = ({
	name,
	photo,
	price,
	quantity,
	productId,
}: OrderItem) => (
	<div className="transaction-product-card">
		<img src={photo} alt={name} />
		<Link to={`/product/${productId}`}>{name}</Link>
		<span>
			₹{price} X {quantity} = ₹{price * quantity}
		</span>
	</div>
);

export default TransactionManagement;
