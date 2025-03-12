import { Product, User } from "./types";

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
