import { 
  addToFavoritesService,
  removeFromFavoritesService,
  getUserFavoritesService,
  isProductInFavoritesService,
  getFavoritesCountService,
  getMultipleProductsFavoriteStatusService,
  clearAllFavoritesService,
  getRecentFavoritesService,
  toggleFavoriteService
} from "../../services/favorite/index.js";

// Add product to user's favorites
const addToFavoritesController = async (req, res) => {
  try {
    const result = await addToFavoritesService(req);
    if (result?.success) {
      return res.status(result?.statusCode).json({
        success: result?.success,
        message: result?.message,
        data: result?.data
      });
    } else {
      return res.status(result?.statusCode).json({
        success: result?.success,
        message: result?.message
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove product from user's favorites
const removeFromFavoritesController = async (req, res) => {
  try {
    const result = await removeFromFavoritesService(req);
    if (result?.success) {
      return res.status(result?.statusCode).json({
        success: result?.success,
        message: result?.message,
        data: result?.data
      });
    } else {
      return res.status(result?.statusCode).json({
        success: result?.success,
        message: result?.message
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user's favorite products
const getUserFavoritesController = async (req, res) => {
  try {
    const result = await getUserFavoritesService(req);
    if (result?.success) {
      return res.status(result?.statusCode).json({
        success: result?.success,
        data: result?.data,
        pagination: result?.pagination
      });
    } else {
      return res.status(result?.statusCode).json({
        success: result?.success,
        message: result?.message
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Check if product is in user's favorites
const isProductInFavoritesController = async (req, res) => {
  try {
    const result = await isProductInFavoritesService(req);
    if (result?.success) {
      return res.status(result?.statusCode).json({
        success: result?.success,
        data: result?.data
      });
    } else {
      return res.status(result?.statusCode).json({
        success: result?.success,
        message: result?.message
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get favorites count for user
const getFavoritesCountController = async (req, res) => {
  try {
    const result = await getFavoritesCountService(req);
    if (result?.success) {
      return res.status(result?.statusCode).json({
        success: result?.success,
        data: result?.data
      });
    } else {
      return res.status(result?.statusCode).json({
        success: result?.success,
        message: result?.message
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get multiple products' favorite status
const getMultipleProductsFavoriteStatusController = async (req, res) => {
  try {
    const result = await getMultipleProductsFavoriteStatusService(req);
    if (result?.success) {
      return res.status(result?.statusCode).json({
        success: result?.success,
        data: result?.data
      });
    } else {
      return res.status(result?.statusCode).json({
        success: result?.success,
        message: result?.message
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Clear all favorites for user
const clearAllFavoritesController = async (req, res) => {
  try {
    const result = await clearAllFavoritesService(req);
    if (result?.success) {
      return res.status(result?.statusCode).json({
        success: result?.success,
        message: result?.message,
        data: result?.data
      });
    } else {
      return res.status(result?.statusCode).json({
        success: result?.success,
        message: result?.message
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get recent favorites
const getRecentFavoritesController = async (req, res) => {
  try {
    const result = await getRecentFavoritesService(req);
    if (result?.success) {
      return res.status(result?.statusCode).json({
        success: result?.success,
        data: result?.data
      });
    } else {
      return res.status(result?.statusCode).json({
        success: result?.success,
        message: result?.message
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Toggle favorite status
const toggleFavoriteController = async (req, res) => {
  try {
    const result = await toggleFavoriteService(req);
    if (result?.success) {
      return res.status(result?.statusCode).json({
        success: result?.success,
        message: result?.message,
        data: result?.data
      });
    } else {
      return res.status(result?.statusCode).json({
        success: result?.success,
        message: result?.message
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const favoriteController = {
  addToFavoritesController,
  removeFromFavoritesController,
  getUserFavoritesController,
  isProductInFavoritesController,
  getFavoritesCountController,
  getMultipleProductsFavoriteStatusController,
  clearAllFavoritesController,
  getRecentFavoritesController,
  toggleFavoriteController
};

export default favoriteController;