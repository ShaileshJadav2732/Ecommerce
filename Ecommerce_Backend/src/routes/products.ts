import express from "express";
import {
  getAdminProducts,
  getAllCategories,
  getLatestProduct,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getAllProducts
} from "../controllers/products.js";
import { adminOnly } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
import NodeCache from "node-cache";
const app = express.Router();


export const myCache = new NodeCache();

// to create new products -/api/v1/product/new
app.post("/new",adminOnly,singleUpload, newProduct);


// to create new products with filters -/api/v1/product/all
app.get("/all",getAllProducts);

// to get last 10 products -/api/v1/product/latest
app.get("/latest", getLatestProduct);
// to get all unique categories -/api/v1/product/categories
app.get("/categories", getAllCategories);
//to get all products /api/v1/product/admin-products
app.get("/admin-products",adminOnly, getAdminProducts);

app.route("/:id")
  .get(getSingleProduct)
  .put(adminOnly,singleUpload, updateProduct)
  .delete(adminOnly,deleteProduct);

export default app;
