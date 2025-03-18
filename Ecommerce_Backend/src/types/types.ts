import { NextFunction, Request, Response } from "express";
export interface NewUserRequestBody {
	name: string;
	email: string;
	dob: Date;
	_id: string;
	photo: string;
	gender: string;
}

export interface NewProductRequestBody {
	name: string;
	category: string;
	price: number;
	stock: number;
}

export type ControllerType = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type searchRequestQuery = {
	search?: string;
	category?: string;
	sort?: string;
	price?: string;
	page?: string;
};

export interface BaseQuery {
	name?: {
		$regex: string;
		$options: string;
	};
	price?: {
		$lte: number;
	};
	category?: string;
}

export type invalidateCacheType = {
	product?: boolean;
	order?: boolean;
	admin?: boolean;
	userId?: string;
	orderId?: string;
	productId?: string | string[];
};

export type orderItem = {
	name: string;
	price: number;
	quantity: number;
	photo: string;
	productId: string;
};

export type ShippingInfo = {
	address: string;
	city: string;
	state: string;
	country: string;
	pinCode: number;
};

export interface NewOrderRequestBody {
	shippingInfo: ShippingInfo;
	user: string;
	orderItems: orderItem[];
	subTotal: number;
	tax: number;
	shippingCharges: number;
	discount: number;
	total: number;
	status: string;
}
