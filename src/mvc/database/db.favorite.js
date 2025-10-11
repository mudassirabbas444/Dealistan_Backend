import Favorite from "../models/favorite.js";
import User from "../models/user.js";
import Product from "../models/product.js";

// Add product to user's favorites
export const addToFavorites = async (userId, productId) => {
  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return {
        success: false,
        message: "Product not found",
        statusCode: 404
      };
    }

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({ user: userId, product: productId });
    if (existingFavorite) {
      return {
        success: false,
        message: "Product already in favorites",
        statusCode: 409
      };
    }

    // Add to favorites collection
    const favorite = new Favorite({
      user: userId,
      product: productId
    });
    await favorite.save();

    // Add to user's favorites array
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: productId } },
      { new: true }
    );

    return {
      success: true,
      message: "Product added to favorites",
      data: favorite,
      statusCode: 201
    };
  } catch (error) {
    throw new Error("Error adding to favorites: " + error.message);
  }
};

// Remove product from user's favorites
export const removeFromFavorites = async (userId, productId) => {
  try {
    // Check if favorite exists
    const favorite = await Favorite.findOne({ user: userId, product: productId });
    if (!favorite) {
      return {
        success: false,
        message: "Product not in favorites",
        statusCode: 404
      };
    }

    // Remove from favorites collection
    await Favorite.deleteOne({ user: userId, product: productId });

    // Remove from user's favorites array
    await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: productId } },
      { new: true }
    );

    return {
      success: true,
      message: "Product removed from favorites",
      data: favorite,
      statusCode: 200
    };
  } catch (error) {
    throw new Error("Error removing from favorites: " + error.message);
  }
};

// Get user's favorite products
export const getUserFavorites = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 20, sortBy = 'addedAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get favorites with populated product data
    const favorites = await Favorite.find({ user: userId })
      .populate({
        path: 'product',
        populate: {
          path: 'seller',
          select: 'name email phone city'
        }
      })
      .populate({
        path: 'product',
        populate: {
          path: 'category',
          select: 'name slug icon'
        }
      })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count
    const totalCount = await Favorite.countDocuments({ user: userId });

    // Extract products from favorites
    const products = favorites.map(favorite => favorite.product).filter(Boolean);

    return {
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      },
      statusCode: 200
    };
  } catch (error) {
    throw new Error("Error getting user favorites: " + error.message);
  }
};

// Check if product is in user's favorites
export const isProductInFavorites = async (userId, productId) => {
  try {
    const favorite = await Favorite.findOne({ user: userId, product: productId });
    
    return {
      success: true,
      data: {
        isFavorite: !!favorite,
        addedAt: favorite?.addedAt || null
      },
      statusCode: 200
    };
  } catch (error) {
    throw new Error("Error checking favorite status: " + error.message);
  }
};

// Get favorites count for user
export const getFavoritesCount = async (userId) => {
  try {
    const count = await Favorite.countDocuments({ user: userId });
    
    return {
      success: true,
      data: { count },
      statusCode: 200
    };
  } catch (error) {
    throw new Error("Error getting favorites count: " + error.message);
  }
};

// Get multiple products' favorite status for a user
export const getMultipleProductsFavoriteStatus = async (userId, productIds) => {
  try {
    const favorites = await Favorite.find({ 
      user: userId, 
      product: { $in: productIds } 
    });

    // Create a map of productId -> favorite status
    const favoriteMap = {};
    favorites.forEach(favorite => {
      favoriteMap[favorite.product.toString()] = {
        isFavorite: true,
        addedAt: favorite.addedAt
      };
    });

    // Fill in missing products as not favorite
    productIds.forEach(productId => {
      if (!favoriteMap[productId]) {
        favoriteMap[productId] = {
          isFavorite: false,
          addedAt: null
        };
      }
    });

    return {
      success: true,
      data: favoriteMap,
      statusCode: 200
    };
  } catch (error) {
    throw new Error("Error getting multiple products favorite status: " + error.message);
  }
};

// Clear all favorites for a user
export const clearAllFavorites = async (userId) => {
  try {
    // Get all favorite products for user
    const favorites = await Favorite.find({ user: userId });
    const productIds = favorites.map(favorite => favorite.product);

    // Remove from favorites collection
    await Favorite.deleteMany({ user: userId });

    // Clear user's favorites array
    await User.findByIdAndUpdate(
      userId,
      { $set: { favorites: [] } },
      { new: true }
    );

    return {
      success: true,
      message: "All favorites cleared",
      data: { removedCount: favorites.length },
      statusCode: 200
    };
  } catch (error) {
    throw new Error("Error clearing favorites: " + error.message);
  }
};

// Get recently added favorites
export const getRecentFavorites = async (userId, limit = 10) => {
  try {
    const favorites = await Favorite.find({ user: userId })
      .populate({
        path: 'product',
        populate: {
          path: 'seller',
          select: 'name email phone city'
        }
      })
      .populate({
        path: 'product',
        populate: {
          path: 'category',
          select: 'name slug icon'
        }
      })
      .sort({ addedAt: -1 })
      .limit(limit);

    const products = favorites.map(favorite => favorite.product).filter(Boolean);

    return {
      success: true,
      data: products,
      statusCode: 200
    };
  } catch (error) {
    throw new Error("Error getting recent favorites: " + error.message);
  }
};