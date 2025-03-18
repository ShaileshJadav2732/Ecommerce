import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../types/reducer-types";
import { CartItem, ShippingInfo } from "../../types/types";

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

// Helper function to calculate prices
const calculatePrices = (state: CartReducerInitialState) => {
	state.subtotal = state.cartItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);

	// Example calculations (adjust as needed)
	state.tax = state.subtotal * 0.1; // 10% tax
	state.shippingCharges = state.subtotal > 1000 ? 0 : 50; // Free shipping above ₹1000
	state.discount = 0; // Reset discount (can be updated based on coupon logic)
	state.total =
		state.subtotal + state.tax + state.shippingCharges - state.discount;
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
				state.cartItems[index] = action.payload; // Update existing item
			} else {
				state.cartItems.push(action.payload); // Add new item
			}

			calculatePrices(state); // Recalculate prices
			state.loading = false;
		},
		removeCartItem: (state, action: PayloadAction<string>) => {
			state.loading = true;
			state.cartItems = state.cartItems.filter(
				(i) => i.productId !== action.payload
			);

			calculatePrices(state); // Recalculate prices
			state.loading = false;
		},
		// Optional: Add a reducer to update shipping info
		updateShippingInfo: (
			state,
			action: PayloadAction<CartReducerInitialState["shippingInfo"]>
		) => {
			state.shippingInfo = action.payload;
		},
		discountApplied: (state, action: PayloadAction<number>) => {
			state.discount = action.payload;
			state.total =
				state.subtotal + state.tax + state.shippingCharges - state.discount;
		},
		saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
			state.shippingInfo = action.payload;
		},
		resetCart: () => initialState,
	},
});

export const {
	addToCart,
	removeCartItem,
	updateShippingInfo,
	discountApplied,
	saveShippingInfo,
	resetCart,
} = cartReducer.actions;
export default cartReducer;
