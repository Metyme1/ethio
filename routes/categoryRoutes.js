const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const subcategoryController = require("../controllers/subCategoryController");

const authMiddleware = require("../middlewares/authmiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.post(
  "/categories",
  authMiddleware,
  roleMiddleware(["admin"]),
  categoryController.createCategory
);
router.get("/categories", categoryController.getCategories);
router.put(
  "/categories/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  categoryController.updateCategory
);
router.delete(
  "/categories/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  categoryController.deleteCategory
);

router.post(
  "/subcategories",
  authMiddleware,
  roleMiddleware(["admin"]),
  subcategoryController.createSubcategory
);
router.get("/subcategories", subcategoryController.getSubcategories);
router.put(
  "/subcategories/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  subcategoryController.updateSubcategory
);
router.delete(
  "/subcategories/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  subcategoryController.deleteSubcategory
);

module.exports = router;
