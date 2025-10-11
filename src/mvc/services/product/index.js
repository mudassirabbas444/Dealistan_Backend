import productServices from "./product-services.js";

export const {
    createProductService,
    getAllProductsService,
    getProductByIdService,
    getProductsBySellerService,
    updateProduct,
    deleteProduct,
    searchProductsService,
    markAsSoldService
} = productServices;

// For backward compatibility
export const addProduct = createProductService;