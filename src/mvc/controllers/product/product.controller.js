import { 
    createProductService,
    getAllProductsService,
    getProductByIdService,
    getProductsBySellerService,
    updateProduct,
    deleteProduct,
    searchProductsService,
    markAsSoldService
} from "../../services/product/index.js";

const createProductController = async (req, res) => {
    try {
        const result = await createProductService(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                product: result?.product
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
}

const getAllProductsController = async (req, res) => {
    try {
        const result = await getAllProductsService(req);
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
}

const getProductByIdController = async (req, res) => {
    try {
        const result = await getProductByIdService(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                product: result?.product
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
}

const getProductsBySellerController = async (req, res) => {
    try {
        const result = await getProductsBySellerService(req);
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
}

const updateProductController = async (req, res) => {
    try {
        const result = await updateProduct(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                product: result?.product
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
}

const deleteProductController = async (req, res) => {
    try {
        const result = await deleteProduct(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                product: result?.product
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
}

const searchProductsController = async (req, res) => {
    try {
        const result = await searchProductsService(req);
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
}

const markAsSoldController = async (req, res) => {
    try {
        const result = await markAsSoldService(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                product: result?.product
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
}

const productController = { 
    createProductController,
    getAllProductsController,
    getProductByIdController,
    getProductsBySellerController,
    updateProductController,
    deleteProductController,
    searchProductsController,
    markAsSoldController
}

export default productController;