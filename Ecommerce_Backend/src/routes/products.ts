
import express from "express";
import {
  getAdminProducts,
  getAllCategories,
  getLatestProduct,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct
} from "../controllers/products.js";
import { adminOnly } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();




// to create new products -/api/v1/product/new
app.post("/new",singleUpload, newProduct);
// to get last 10 products -/api/v1/product/latest
app.get("/latest", getLatestProduct);
// to get all unique categories -/api/v1/product/categories
app.get("/categories", getAllCategories);
//to get all products /api/v1/product/admin-products
app.get("/admin-products", getAdminProducts);

app.route("/:id")
  .get(getSingleProduct)
  .put(singleUpload, updateProduct)
  .delete(deleteProduct);

export default app;
