import express from "express";
import productController from "../../controllers/product/product.controller.js";
import { productRoutes } from "../routes-strings.js";
import auth from "../../middlewares/auth.js";
import { validateProductImagesMiddleware, sanitizeRequestBody } from "../../middlewares/firebaseValidation.js";

const router=express.Router();

// Create product (requires authentication)
router.post(productRoutes.ADD_PRODUCT, auth, sanitizeRequestBody, validateProductImagesMiddleware, productController.createProductController);

// Get all products (requires authentication)
router.get(productRoutes.GET_ALL_PRODUCTS, auth, productController.getAllProductsController);

// Get product by ID (requires authentication)
router.get(productRoutes.GET_PRODUCT, auth, productController.getProductByIdController);

// Get products by seller (requires authentication)
router.get(productRoutes.GET_PRODUCTS_BY_SELLER, auth, productController.getProductsBySellerController);

// Search products (requires authentication)
router.get(productRoutes.SEARCH_PRODUCTS, auth, productController.searchProductsController);

// Update product (requires authentication)
router.put(productRoutes.UPDATE_PRODUCT, auth, sanitizeRequestBody, validateProductImagesMiddleware, productController.updateProductController);

// Delete product (requires authentication)
router.delete(productRoutes.DELETE_PRODUCT, auth, productController.deleteProductController);

// Mark product as sold (requires authentication)
router.patch(productRoutes.MARK_AS_SOLD, auth, productController.markAsSoldController);

export { router as productRouter };
