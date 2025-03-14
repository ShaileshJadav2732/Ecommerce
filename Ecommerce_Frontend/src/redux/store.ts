import { orderAPI } from "./api/orderApi";
import { configureStore } from "@reduxjs/toolkit";
import { productAPI } from "./api/productApi";
import { userAPI } from "./api/userApi";
import { userReducer } from "./reducer/userReducer";
import { cartReducer } from "./reducer/cartReducer";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
	reducer: {
		// API reducers to handle async actions
		[userAPI.reducerPath]: userAPI.reducer,
		[productAPI.reducerPath]: productAPI.reducer,
		[orderAPI.reducerPath]: orderAPI.reducer,
		[cartReducer.name]: cartReducer.reducer,

		// Sync user state reducer
		user: userReducer.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			userAPI.middleware,
			productAPI.middleware,
			orderAPI.middleware
		),
});

export type RootState = ReturnType<typeof store.getState>;
