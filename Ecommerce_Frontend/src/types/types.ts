export interface User {
	name: string;
	email: string;
	photo: string;
	gender: string;
	role: string;
	dob: string;
	_id: string;
}

export type Product = {
	name: string;
	category: string;
	price: number;
	photo: string;
	stock: number;
	_id: string;
};
export type ShippingInfo = {
	address: string;
	city: string;
	state: string;
	country: string;
	pinCode: string;
};
export type CartItem = {
	productId: string;
	photo: string;
	name: string;
	price: number;
	quantity: number;
	stock: number;
};

export type OrderItem = Omit<CartItem, "stock"> & { _id: string };

export type Order = {
	orderItems: OrderItem[];
	shippingInfo: ShippingInfo;
	subtotal: number;
	tax: number;
	shippingCharges: number;
	discount: number;
	total: number;
	status: string;
	user: {
		name: string;
		_id: string;
	};
	_id: string;
};

type CountAndChange = {
	thisMonthRevenue: number;
	user: number;
	product: number;
	order: number;
};

type Count = { revenue: number; product: number; user: number; order: number };

type LatestTransaction = {
	_id: string;
	amount: number;
	discount: number;
	quantity: number;
	status: string;
};

export type State = {
	categories: string[];
	categoryCount: Record<string, number>[]; // {category: count}
	changePercent: CountAndChange;
	count: Count;
	chart: {
		order: number[];
		revenue: number[];
	};
	userRatio: {
		male: number;
		female: number;
	};
	latestTransaction: LatestTransaction[];
};

export type Pie = {
	orderFulfillment: {
		processing: number;
		shipped: number;
		delivered: number;
	};
	productCategories: Record<string, number>[];
	stockAvailability: {
		inStock: number;
		outOfStock: number;
	};
	revenueDistribution: {
		netMargin: number;
		discount: number;
		productionCost: number;
		burnt: number;
		marketingCost: number;
	};
	userAgeGoup: {
		teen: number;
		adult: number;
		old: number;
	};
	adminCustomer: {
		admin: number;
		cutomer: number;
	};
};
