import {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  isProductInFavorites,
  getFavoritesCount,
  getMultipleProductsFavoriteStatus,
  clearAllFavorites,
  getRecentFavorites
} from "../../database/db.favorite.js";

// Add product to user's favorites
const addToFavoritesService = async (req) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    const result = await addToFavorites(userId, productId);
    return result;
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: error.message
    };
  }
};

// Remove product from user's favorites
const removeFromFavoritesService = async (req) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    const result = await removeFromFavorites(userId, productId);
    return result;
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: error.message
    };
  }
};

// Get user's favorite products
const getUserFavoritesService = async (req) => {
  try {
    const userId = req.user.id;
    const options = {
      page: req?.query?.page || 1,
      limit: req?.query?.limit || 20,
      sortBy: req?.query?.sortBy || 'addedAt',
      sortOrder: req?.query?.sortOrder || 'desc'
    };
    const result = await getUserFavorites(userId, options);
    return result;
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: error.message
    };
  }
};

// Check if product is in user's favorites
const isProductInFavoritesService = async (req) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    const result = await isProductInFavorites(userId, productId);
    return result;
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: error.message
    };
  }
};

// Get favorites count for user
const getFavoritesCountService = async (req) => {
  try {
    const userId = req.user.id;
    const result = await getFavoritesCount(userId);
    return result;
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: error.message
    };
  }
};

// Get multiple products' favorite status
const getMultipleProductsFavoriteStatusService = async (req) => {
  try {
    const { productIds } = req.body;
    const userId = req.user.id;
    const result = await getMultipleProductsFavoriteStatus(userId, productIds);
    return result;
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: error.message
    };
  }
};

// Clear all favorites for user
const clearAllFavoritesService = async (req) => {
  try {
    const userId = req.user.id;
    const result = await clearAllFavorites(userId);
    return result;
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: error.message
    };
  }
};

// Get recent favorites
const getRecentFavoritesService = async (req) => {
  try {
    const userId = req.user.id;
    const limit = req?.query?.limit || 10;
    const result = await getRecentFavorites(userId, limit);
    return result;
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: error.message
    };
  }
};

// Toggle favorite status (add if not exists, remove if exists)
const toggleFavoriteService = async (req) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    
    // Check if already in favorites
    const isFavoriteResult = await isProductInFavorites(userId, productId);
    
    if (!isFavoriteResult.success) {
      return isFavoriteResult;
    }

    let result;
    if (isFavoriteResult.data.isFavorite) {
      // Remove from favorites
      result = await removeFromFavorites(userId, productId);
    } else {
      // Add to favorites
      result = await addToFavorites(userId, productId);
    }

    return result;
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: error.message
    };
  }
};

export default {
  addToFavoritesService,
  removeFromFavoritesService,
  getUserFavoritesService,
  isProductInFavoritesService,
  getFavoritesCountService,
  getMultipleProductsFavoriteStatusService,
  clearAllFavoritesService,
  getRecentFavoritesService,
  toggleFavoriteService
};