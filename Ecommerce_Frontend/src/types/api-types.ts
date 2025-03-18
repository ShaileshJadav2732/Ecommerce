import { ShippingInfo } from "./types";
import { CartItem, Order, Product, User } from "./types";

export type CustomeError = {
	statusCode: number;
	data: {
		message: string;
		success: boolean;
	};
};

export type MessageResponse = {
	success: boolean;
	message: string;
};
export type AllUsersResponse = {
	success: boolean;
	users: User[];
};
export type UserResponse = {
	user: User;
	success: boolean;
	message: string;
};
export type AllProductsResponse = {
	products: Product[];
	success: boolean;
};
export type CategoriesResponse = {
	categories: string[];
	success: boolean;
};

export type SearchProductsResponse = AllProductsResponse & {
	totalPage: number;
};

export type SearchProductsRequest = {
	price: number;
	page: number;
	category: string;
	search: string;
	sort: string;
};
export type ProductResponse = {
	success: boolean;
	product: Product;
};
export type NewProductRequest = {
	id: string;
	formData: FormData;
};
export type UpdateProductRequest = {
	userId: string; //admin id
	productId: string;
	formData: FormData;
};

export type DeleteProductRequest = {
	userId: string; //admin id
	productId: string;
};

export type NewOrderRequest = {
	shippingInfo: ShippingInfo;
	cartItems: CartItem[];
	subtotal: number;
	tax: number;
	shippingCharges: number;
	discount: number;
	total: number;
	user: string;
};

export type AllordersResponse = {
	success: boolean;
	orders: Order[];
};
export type OrderDetalisResponse = {
	success: boolean;
	order: Order;
};

export type DeleteUserRequest = {
	userId: string;
	adminUserId: string;
};
export type UpdateOrderRequest = {
	userId: string;
	orderId: string;
};
