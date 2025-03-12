import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../types/reducer-types";
import { CartItem } from "../../types/types";

const initialState: CartReducerInitialState = {
	loading: false,
	cartItems: [],
	subtotal: 0,
	tax: 0,
	shippingCharges: 0,
	discount: 0,
	total: 0,
	shippingInfo: {
		address: "",
		city: "",
		state: "",
		country: "",
		pinCode: "",
	},
};
export const cartReducer = createSlice({
	name: "cartReducer",
	initialState,
	reducers: {
		addToCart: (state, action: PayloadAction<CartItem>) => {
			state.loading = true;

			const index = state.cartItems.findIndex(
				(i) => i.productId === action.payload.productId
			);
			if (index !== -1) {
				state.cartItems[index].quantity += action.payload.quantity;
			} else {
				state.cartItems.push(action.payload);
				state.loading = false;
			}
		},
		removeCartItem: (state, action: PayloadAction<string>) => {
			state.loading = true;
			state.cartItems = state.cartItems.filter(
				(i) => i.productId !== action.payload
			);
			state.loading = false;
		},
	},
});

export const { addToCart, removeCartItem } = cartReducer.actions;
export default cartReducer;
