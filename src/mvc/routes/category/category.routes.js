import express from "express";
import categoryController from "../../controllers/category/category.controller.js";
import { categoryRoutes } from "../routes-strings.js";
import auth from "../../middlewares/auth.js";
import isAdmin from "../../middlewares/isAdmin.js";

const router = express.Router();

// Create category (requires authentication - admin only)
router.post(categoryRoutes.CREATE_CATEGORY, auth, isAdmin, categoryController.createCategoryController);

// Get all categories (public)
router.get(categoryRoutes.GET_ALL_CATEGORIES, categoryController.getAllCategoriesController);

// Get category by ID (public)
router.get(categoryRoutes.GET_CATEGORY_BY_ID, categoryController.getCategoryByIdController);

// Update category (requires authentication - admin only)
router.put(categoryRoutes.UPDATE_CATEGORY, auth, isAdmin, categoryController.updateCategoryController);

// Delete category (requires authentication - admin only)
router.delete(categoryRoutes.DELETE_CATEGORY, auth, isAdmin, categoryController.deleteCategoryController);

export { router as categoryRouter };
