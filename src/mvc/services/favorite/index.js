import favoriteServices from "./favorite-services.js";

export const {
  addToFavoritesService,
  removeFromFavoritesService,
  getUserFavoritesService,
  isProductInFavoritesService,
  getFavoritesCountService,
  getMultipleProductsFavoriteStatusService,
  clearAllFavoritesService,
  getRecentFavoritesService,
  toggleFavoriteService
} = favoriteServices;