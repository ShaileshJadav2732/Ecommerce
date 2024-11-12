import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import Product from "../models/product.js";
import {
  BaseQuery,
  NewProductRequestBody,
  searchRequestQuery,
} from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { promises as fsPromises } from "fs";
import { myCache } from "../routes/product.js";
import { invalidateCache } from "../utils/features.js";

// Controller to get the latest products
export const getLatestProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    let products;
    // if cache has latest products then return it
    if (myCache.has("latest-products"))
      products = JSON.parse(myCache.get("latest-products") as string);
    else {
      // if cache does not have latest products then fetch it from database
      products = await Product.find({}) // Fetching all products
        .sort({
          createdAt: -1, // Sort in descending order by creation date
        })
        .limit(5); // Limit to the latest 5 products
      myCache.set("latest-products", JSON.stringify(products));
    }
    return res.status(200).json({
      success: true,
      products,
    });
  }
);

// Controller to get all product categories
export const getAllCategories = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    let categories = myCache.get("categories");
    if (categories) {
      return res.status(200).json({ success: true, categories: categories });
    } else {
      categories = await Product.distinct("category"); // Fetch distinct categories from products
      myCache.set("categories", categories);
    }
    return res.status(200).json({
      success: true,
      categories,
    });
  }
);

// Controller to get all products for admin
export const getAdminProducts = TryCatch(async (req, res, next) => {
  let products;
  if (myCache.has("admin-products"))
    products = JSON.parse(myCache.get("admin-products") as string);
  else {
    products = await Product.find({}); // Fetch all products
    myCache.set("admin-products", JSON.stringify(products));
  }
  return res.status(200).json({
    success: true,
    products,
  });
});

// Controller to get a single product by ID
export const getSingleProduct = TryCatch(async (req, res, next) => {
  let id = req.params.id;
  let product;
  if (myCache.has(`product-${id}`))
    product = JSON.parse(myCache.get(`product-${id}`) as string);
  else {
    product = await Product.findById(req.params.id); // Fetch product by ID
    myCache.set(`product-${id}`, JSON.stringify(product));
  }
  if (!product) return next(new ErrorHandler("Product Not Found", 404));
  return res.status(200).json({
    success: true,
    product,
  });
});

// Controller to create a new product
export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file; // Getting the uploaded photo from request

    if (!photo) return next(new ErrorHandler("please Add Photo", 400));

    if (!name || !price || !stock || !category) {
      // Delete photo in upload folder if validation fails
      rm(photo.path, () => {
        console.log("Deleted"); // Log deletion of photo
      });

      return next(new ErrorHandler("Please enter all Fields", 400));
    }
    // Create a new product in the database
    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo.path, // Store photo path
    });

    await invalidateCache({ product: true });
    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
    });
  }
);

// Controller to update a product by ID
export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params; // Get product ID from request parameters
  const { name, price, stock, category } = req.body;
  const photo = req.file; // Get the uploaded photo from request
  const product = await Product.findById(id); // Fetch product by ID
  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  if (photo) {
    // If a new photo is uploaded
    try {
      await fsPromises.unlink(product.photo); // Delete old photo
      console.log("Old Photo Deleted");
      product.photo = photo.path; // Update product photo path
    } catch (error) {
      console.error("Error deleting old photo:", error); // Log error if deletion fails
      return next(new ErrorHandler("Error updating product photo", 500));
    }
  }

  // Update product fields if provided
  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category.toLowerCase();

  await product.save(); // Save updated product
  await invalidateCache({ product: true });
  return res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
  });
});

// Controller to delete a product by ID
export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id); // Fetch product by ID
  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  rm(product.photo, () => {
    // Delete product photo
    console.log(" Product Photo Deleted");
  });

  await product.deleteOne(); // Delete product from database
  await invalidateCache({ product: true });
  return res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

// Controller to get all products with optional search and pagination
export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, searchRequestQuery>, res, next) => {
    const { search, category, sort, price } = req.query;

    // This is for pagination
    const page = Number(req.query.page) || 1; // Get current page or default to 1
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = limit * (page - 1); // Calculate number of documents to skip

    const baseQuery: BaseQuery = {
      // Initialize base query
      // name: {
      //   $regex: search || "",
      //   $options: "i",
      // },
      // price: {
      //   $lte: Number(price),
      // },
      // category,
    };

    if (search)
      // If search query is provided
      baseQuery.name = {
        $regex: search, // Use regex for case-insensitive search
        $options: "i",
      };
    if (price)
      // If price query is provided
      baseQuery.price = {
        $lte: Number(price), // Filter products with price less than or equal to the specified price
      };
    if (category) baseQuery.category = category; // If category query is provided, add to base query

    const productsPromise = await Product.find(baseQuery) // Fetch products based on base query
      .sort(
        sort && {
          price: sort === "asc" ? 1 : -1, // Sort products based on price
        }
      )
      .limit(limit) // Limit results to specified number
      .skip(skip); // Skip documents for pagination

    // Using Promise.all to run multiple asynchronous operations concurrently.
    // This allows us to fetch the products and filtered products at the same time,
    // improving performance by reducing the total wait time.

    const [products, filteredOnlyProduct] = await Promise.all([
      productsPromise,
      Product.find(baseQuery), // Fetch products and filtered products concurrently
    ]);

    // const filteredOnlyProduct = await Product.find(baseQuery);

    const totalPage = Math.ceil(filteredOnlyProduct.length / limit); // Calculate total pages

    return res.status(200).json({
      // Return success response with products and total pages
      success: true,
      products,
      totalPage,
    });
  }
);
