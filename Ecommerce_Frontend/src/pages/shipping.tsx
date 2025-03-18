import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import countryList from "react-select-country-list";
import { server } from "../redux/store";
import { CartReducerInitialState } from "../types/reducer-types";
import { saveShippingInfo } from "../redux/reducer/cartReducer";

const Shipping = () => {
	const { cartItems, total } = useSelector(
		(state: { cartReducer: CartReducerInitialState }) => state.cartReducer
	);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [countryOptions, setCountryOptions] = useState(countryList().getData());
	const [shippingInfo, setShippingInfo] = useState({
		address: "",
		city: "",
		state: "",
		country: "",
		pinCode: "",
	});

	const changeHandler = (
		e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
	) => {
		setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
	};

	const handleCountryChange = (selectedCountry: any) => {
		setShippingInfo({ ...shippingInfo, country: selectedCountry.value });
	};

	const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		dispatch(saveShippingInfo(shippingInfo));

		try {
			const { data } = await axios.post(
				`${server}/api/v1/payment/create`,
				{ amount: total },
				{
					headers: {
						"Content-type": "application/json",
					},
				}
			);
			navigate("/pay", { state: data.clientSecret });
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong");
		}
	};

	useEffect(() => {
		if (cartItems.length <= 0) {
			navigate("/cart");
		}
	}, [cartItems]);

	return (
		<div className="shipping">
			<button className="back-btn" onClick={() => navigate("/cart")}>
				<BiArrowBack />
			</button>

			<form onSubmit={submitHandler}>
				<h1>Shipping Address</h1>
				<input
					type="text"
					name="address"
					placeholder="Address"
					value={shippingInfo.address}
					onChange={changeHandler}
				/>
				<input
					type="text"
					name="city"
					placeholder="City"
					value={shippingInfo.city}
					onChange={changeHandler}
				/>
				<Select
					options={countryOptions}
					value={countryOptions.find(
						(option) => option.value === shippingInfo.country
					)}
					onChange={handleCountryChange}
					placeholder="Select Country"
					className="country-dropdown"
				/>
				<input
					type="text"
					name="state"
					placeholder="State"
					value={shippingInfo.state}
					onChange={changeHandler}
				/>
				<input
					type="text"
					name="pinCode"
					placeholder="PinCode"
					value={shippingInfo.pinCode}
					onChange={changeHandler}
				/>
				<button type="submit">Proceed to Payment</button>
			</form>
		</div>
	);
};

export default Shipping;
