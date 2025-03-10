import { NewProductRequestBody } from "./../../../Ecommerce_Backend/src/types/types";
import { AllProductResponse } from "./api-types";
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
export type AllProductResponse = {
	products: Product[];
	success: boolean;
};
export type CategoriesResponse = {
	categories: string[];
	success: boolean;
};

export type SearchProductResponse = AllProductResponse & {
	totalPage: number;
};

export type SearchProductRequest = {
	price: number;
	page: number;
	category: string;
	search: string;
	sort: string;
};
export type NewProductRequest = {
	id: string;
	formData: FormData;
};
