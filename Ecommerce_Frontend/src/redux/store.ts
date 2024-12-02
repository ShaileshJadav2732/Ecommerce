import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/userApi";
import {userReducer} from "./reducer/userReducer";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer: {
    // API reducer to handle async actions
    [userAPI.reducerPath]: userAPI.reducer,

    // Sync user state reducer
    user: userReducer.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    // Add the API middleware for handling async requests
    getDefaultMiddleware().concat(userAPI.middleware),
});
 