import express from "express";
import favoriteController from "../../controllers/favorite/favorite.controller.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Add product to favorites
router.post("/add/:productId", favoriteController.addToFavoritesController);

// Remove product from favorites
router.delete("/remove/:productId", favoriteController.removeFromFavoritesController);

// Toggle favorite status (add if not exists, remove if exists)
router.patch("/toggle/:productId", favoriteController.toggleFavoriteController);

// Get user's favorite products
router.get("/", favoriteController.getUserFavoritesController);

// Get user's recent favorites
router.get("/recent", favoriteController.getRecentFavoritesController);

// Get favorites count for user
router.get("/count", favoriteController.getFavoritesCountController);

// Check if specific product is in user's favorites
router.get("/check/:productId", favoriteController.isProductInFavoritesController);

// Get multiple products' favorite status
router.post("/check-multiple", favoriteController.getMultipleProductsFavoriteStatusController);

// Clear all favorites for user
router.delete("/clear", favoriteController.clearAllFavoritesController);

export { router as favoriteRouter };
