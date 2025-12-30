const express = require("express");
const router = express.Router();
const {
  addProduct,
  addAllProducts,
  getAllProducts,
  getShowingProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  updateManyProducts,
  updateStatus,
  deleteProduct,
  deleteManyProducts,
  getShowingStoreProducts,
  updateProductOrder,
  getProductsByCategory,
  getProductCountByCategory,
  deleteProductsByCategory,
} = require("../controller/productController");

//add a product
router.post("/add", addProduct);

//add multiple products
router.post("/all", addAllProducts);

//get a product
router.post("/:id", getProductById);

//get showing products only
router.get("/show", getShowingProducts);

//get showing products in store
router.get("/store", getShowingStoreProducts);

//get products grouped by category
router.get("/by-category", getProductsByCategory);

//get product count by category (for delete confirmation)
router.get("/count/:categoryId", getProductCountByCategory);

//get all products
router.get("/", getAllProducts);

//get a product by slug
router.get("/product/:slug", getProductBySlug);

//update a product
router.patch("/:id", updateProduct);

//update many products
router.patch("/update/many", updateManyProducts);

// update product order
router.put("/order/update", updateProductOrder);

//update a product status
router.put("/status/:id", updateStatus);

//delete products by category
router.delete("/by-category/:categoryId", deleteProductsByCategory);

//delete a product
router.delete("/:id", deleteProduct);

//delete many product
router.patch("/delete/many", deleteManyProducts);

module.exports = router;

