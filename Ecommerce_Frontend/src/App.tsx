import { onAuthStateChanged } from "firebase/auth";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoute from "./components/admin/protected-route";
import Loader from "./components/loader";
import { auth } from "./firebase";
import { getUser } from "./redux/api/userApi";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { UserReducerInitialState } from "./types/reducer-types";
import Checkout from "./pages/checkOut";

const Home = lazy(() => import("./pages/home"));
const Search = lazy(() => import("./pages/search"));
const Cart = lazy(() => import("./pages/cart"));
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const Shipping = lazy(() => import("./pages/shipping"));
const Login = lazy(() => import("./pages/login"));
const ProductManagement = lazy(
	() => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
	() => import("./pages/admin/transactionmanagement")
);
const Header = lazy(() => import("./components/header"));
const Orders = lazy(() => import("./pages/orders"));
const OrderDetails = lazy(() => import("./pages/order-details"));
const NotFound = lazy(() => import("./pages/not-found"));
const App = () => {
	const { user, loading } = useSelector(
		(state: { user: UserReducerInitialState }) => state.user
	);
	const dispatch = useDispatch();
	console.log(user);
	useEffect(() => {
		onAuthStateChanged(auth, async (user) => {
			try {
				if (user) {
					console.log("User authenticated:", user);
					console.log(user.uid);
					const data = await getUser(user.uid);
					console.log("Fetched user data:", data);
					dispatch(userExist(data.user));
				} else {
					console.log("No user authenticated");
					dispatch(userNotExist());
				}
			} catch (error) {
				console.error("Error fetching user:", error);
				dispatch(userNotExist());
			}
		});
	}, []);

	return loading ? (
		<Loader />
	) : (
		<Router>
			<Suspense fallback={<Loader />}>
				<Header user={user} />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/search" element={<Search />} />
					<Route path="/cart" element={<Cart />} />

					<Route
						path="/login"
						element={
							<ProtectedRoute isAuthenticated={user ? false : true}>
								<Login />
							</ProtectedRoute>
						}
					/>
					<Route
						element={<ProtectedRoute isAuthenticated={user ? true : false} />}
					>
						<Route path="/shipping" element={<Shipping />} />
						<Route path="/orders" element={<Orders />} />
						<Route path="/order/:id" element={<OrderDetails />} />
						{/* <Route path="/pay" element={<Checkout />} /> */}
					</Route>

					{/* Admin Routes */}
					<Route
						element={
							<ProtectedRoute
								isAuthenticated={user?.role === "admin" ? true : false}
							/>
						}
					>
						<Route path="/admin/dashboard" element={<Dashboard />} />
						<Route path="/admin/product" element={<Products />} />
						<Route path="/admin/customer" element={<Customers />} />
						<Route path="/admin/transaction" element={<Transaction />} />
						<Route path="/admin/chart/bar" element={<Barcharts />} />
						<Route path="/admin/chart/pie" element={<Piecharts />} />
						<Route path="/admin/chart/line" element={<Linecharts />} />
						<Route path="/admin/app/coupon" element={<Coupon />} />
						<Route path="/admin/app/stopwatch" element={<Stopwatch />} />
						<Route path="/admin/app/toss" element={<Toss />} />
						<Route path="/admin/product/new" element={<NewProduct />} />
						<Route path="/admin/product/:id" element={<ProductManagement />} />
						<Route
							path="/admin/transaction/:id"
							element={<TransactionManagement />}
						/>
					</Route>
					<Route path="/pay" element={<Checkout />}></Route>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Suspense>
			<Toaster position="top-center" reverseOrder />
		</Router>
	);
};

export default App;
