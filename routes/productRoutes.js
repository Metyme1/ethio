const express = require("express");
const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const upload = require("../config/multerConfig");
const authMiddleware = require("../middlewares/authmiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", getProducts);

// POST /api/products (Create new product with image upload)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload.single("image_url"),
  createProduct
);

// GET /api/products/:id (Get product by ID)
router.get("/:id", getProductById);

// PUT /api/products/:id (Update product by ID)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload.single("image_url"),
  updateProduct
);

// DELETE /api/products/:id (Delete product by ID)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteProduct);

module.exports = router;
