import { myCache } from "./../routes/product.js";
import { TryCatch } from "../middlewares/error.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import Order from "./../models/order.js";
import {
	calculatePercentage,
	getChartData,
	getInventories,
} from "../utils/features.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
	let stats = {};
	const key = "admin-stats";
	if (myCache.has(key)) stats = JSON.parse(myCache.get(key) as string);
	else {
		const today = new Date();
		const sixMonthAgo = new Date();
		sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

		const thisMonth = {
			start: new Date(today.getFullYear(), today.getMonth(), 1),
			end: today,
		};

		const lastMonth = {
			start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
			end: new Date(today.getFullYear(), today.getMonth()),
		};

		const thisMonthProductPromise = await Product.find({
			createdAt: {
				$gte: thisMonth.start,
				$lte: thisMonth.end,
			},
		});
		const lastMonthProductPromise = await Product.find({
			createdAt: {
				$gte: lastMonth.start,
				$lte: lastMonth.end,
			},
		});
		const thisMonthUserPromise = await User.find({
			createdAt: {
				$gte: thisMonth.start,
				$lte: thisMonth.end,
			},
		});
		const lastMonthUserPromise = await User.find({
			createdAt: {
				$gte: lastMonth.start,
				$lte: lastMonth.end,
			},
		});
		const thisMonthOrderPromise = await Order.find({
			createdAt: {
				$gte: thisMonth.start,
				$lte: thisMonth.end,
			},
		});

		const lastMonthOrderPromise = await Order.find({
			createdAt: {
				$gte: lastMonth.start,
				$lte: lastMonth.end,
			},
		});

		const lastSixMonthOrdersPromise = await Order.find({
			createdAt: {
				$gte: sixMonthAgo,
				$lte: today,
			},
		});
		const latestTransactionPromise = Order.find({})
			.select(["orderItems", "discount", "total", "status"])
			.limit(4);

		const [
			thisMonthOrder,
			thisMonthProduct,
			thisMonthUser,
			lastMonthOrder,
			lastMonthProduct,
			lastMonthUser,
			productsCount,
			usersCount,
			allOrders,
			lastSixMonthOrders,
			categories,
			femaleUsersCount,
			latestTransaction,
		] = await Promise.all([
			thisMonthOrderPromise,
			thisMonthProductPromise,
			thisMonthUserPromise,
			lastMonthOrderPromise,
			lastMonthProductPromise,
			lastMonthUserPromise,
			Product.countDocuments(),
			User.countDocuments(),
			Order.find({}).select("total"),
			lastSixMonthOrdersPromise,
			Product.distinct("category"),
			User.countDocuments({ gender: "female" }),
			latestTransactionPromise,
		]);

		const thisMonthRevenue = thisMonthOrder.reduce(
			(total, order) => total + (order.total || 0),
			0
		);
		const lastMonthRevenue = thisMonthOrder.reduce(
			(total, order) => total + (order.total || 0),
			0
		);

		const changePercent = {
			thisMonthRevenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
			user: calculatePercentage(thisMonthUser.length, lastMonthUser.length),
			product: calculatePercentage(
				thisMonthProduct.length,
				lastMonthProduct.length
			),
			order: calculatePercentage(thisMonthOrder.length, lastMonthOrder.length),
		};
		const revenue = allOrders.reduce(
			(total, order) => total + (order.total || 0),
			0
		);

		const count = {
			revenue,
			product: productsCount,
			user: usersCount,
			order: allOrders.length,
		};
		const orderMonthCounts = new Array(6).fill(0);
		const orderMonthRevenue = new Array(6).fill(0);

		lastSixMonthOrders.forEach((order) => {
			const creationDate = order.createdAt;
			const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

			if (monthDiff < 6) {
				orderMonthCounts[6 - monthDiff - 1] += 1;
				orderMonthRevenue[6 - monthDiff - 1] += order.total;
			}
		});

		const categoryCount = await getInventories({
			categories,
			productsCount,
		});

		const userRatio = {
			male: usersCount - femaleUsersCount,
			female: femaleUsersCount,
		};

		const modifiedLatestTransaction = latestTransaction.map((i) => ({
			_id: i._id,
			discount: i.discount,
			amount: i.total,
			quantity: i.orderItems.length,
			status: i.status,
		}));
		stats = {
			categories,
			categoryCount,
			changePercent,
			count,
			chart: {
				order: orderMonthCounts,
				revenue: orderMonthRevenue,
			},
			userRatio,
			latestTransaction: modifiedLatestTransaction,
		};
	}

	myCache.set(key, JSON.stringify(stats));
	return res.status(200).json({
		success: true,
		stats: stats,
	});
});

export const getPieCharts = TryCatch(async (req, res, next) => {
	let charts;
	const key = "admin-pie-charts";
	if (myCache.has(key)) charts = JSON.parse(myCache.get(key) as string);
	else {
		const allOrderPromise = Order.find({}).select([
			"total",
			"discount",
			"subtotal",
			"tax",
			"shippingCharges",
		]);

		const [
			processingOrder,
			shippedOrder,
			deliveredOrder,
			categories,
			productsCount,
			outOfStock,
			allOrders,
			allUsers,
			adminUsers,
			customerUsers,
		] = await Promise.all([
			Order.countDocuments({ status: "Processing" }),
			Order.countDocuments({ status: "Shipped" }),
			Order.countDocuments({ status: "Delivered" }),
			Product.distinct("category"),
			Product.countDocuments(),
			Product.countDocuments({ stock: 0 }),
			allOrderPromise,
			User.find({}).select(["dob"]),
			User.countDocuments({ role: "admin" }),
			User.countDocuments({ role: "user" }),
		]);

		const orderFulfillment = {
			processing: processingOrder,
			shipped: shippedOrder,
			delivered: deliveredOrder,
		};

		const productCategories = await getInventories({
			categories,
			productsCount,
		});

		const stockAvailability = {
			inStock: productsCount - outOfStock,
			outOfStock,
		};
		const grossIncome = allOrders.reduce(
			(prev, order) => prev + (order.total || 0),
			0
		);
		const discount = allOrders.reduce(
			(prev, order) => prev + (order.discount || 0),
			0
		);
		const productionCost = allOrders.reduce(
			(prev, order) => prev + (order.shippingCharges || 0),
			0
		);
		const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);
		const marketingCost = Math.round(grossIncome * (30 / 100));

		const netMargin =
			grossIncome - discount - productionCost - burnt - marketingCost;

		const revenueDistribution = {
			netMargin,
			discount,
			productionCost,
			burnt,
			marketingCost,
		};

		const userAgeGoup = {
			teen: allUsers.filter((i) => i.age < 20).length,
			adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
			old: allUsers.filter((i) => i.age >= 40).length,
		};
		const adminCustomer = {
			admin: adminUsers,
			cutomer: customerUsers,
		};

		charts = {
			orderFulfillment,
			productCategories,
			stockAvailability,
			revenueDistribution,
			userAgeGoup,
			adminCustomer,
		};

		myCache.set(key, JSON.stringify(charts));
	}
	return res.status(200).json({
		success: true,
		charts,
	});
});

export const getBarCharts = TryCatch(async (req, res, next) => {
	let charts;
	const key = "admin-bar-charts";
	if (myCache.has(key)) charts = JSON.parse(myCache.get(key) as string);
	else {
		const today = new Date();
		const sixMonthAgo = new Date();
		sixMonthAgo.setMonth(today.getMonth() - 6);

		const twelveMonthAgo = new Date();
		twelveMonthAgo.setMonth(today.getMonth() - 12);

		const SixMonthProductPromise = Product.find({
			createdAt: { $gte: sixMonthAgo, $lte: today },
		}).select("createdAt");

		const SixMonthUserPromise = User.find({
			createdAt: { $gte: sixMonthAgo, $lte: today },
		}).select("createdAt");

		const twelveMonthOrderPromise = Order.find({
			createdAt: { $gte: twelveMonthAgo, $lte: today },
		}).select("createdAt");

		const [products, users, orders] = await Promise.all([
			SixMonthProductPromise,
			SixMonthUserPromise,
			twelveMonthOrderPromise,
		]);

		const productCounts = getChartData({ length: 6, today, docArr: products });
		const userCounts = getChartData({ length: 6, today, docArr: users });
		const orderCounts = getChartData({ length: 12, today, docArr: orders });

		charts = { productCounts, userCounts, orderCounts };
		myCache.set(key, JSON.stringify(charts));
	}
	return res.status(200).json({
		success: true,
		charts,
	});
});

export const getLineCharts = TryCatch(async (req, res, next) => {
	let charts;
	const key = "admin-line-charts";

	if (myCache.has(key)) charts = JSON.parse(myCache.get(key) as string);

	if (charts) charts = JSON.parse(charts);
	else {
		const today = new Date();

		const twelveMonthsAgo = new Date();
		twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

		const baseQuery = {
			createdAt: {
				$gte: twelveMonthsAgo,
				$lte: today,
			},
		};

		const [products, users, orders] = await Promise.all([
			Product.find(baseQuery).select("createdAt"),
			User.find(baseQuery).select("createdAt"),
			Order.find(baseQuery).select(["createdAt", "discount", "total"]),
		]);

		const productCounts = getChartData({ length: 12, today, docArr: products });
		const usersCounts = getChartData({ length: 12, today, docArr: users });
		const discount = getChartData({
			length: 12,
			today,
			docArr: orders,
			property: "discount",
		});
		const revenue = getChartData({
			length: 12,
			today,
			docArr: orders,
			property: "total",
		});

		charts = {
			users: usersCounts,
			products: productCounts,
			discount,
			revenue,
		};

		myCache.set(key, JSON.stringify(charts));
	}

	return res.status(200).json({
		success: true,
		charts,
	});
});
