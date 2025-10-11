import { 
    createCategoryService,
    getCategoryByIdService,
    updateCategory,
    getAllCategoriesService,
    deleteCategory
} from "../../services/category/index.js";

const createCategoryController = async (req, res) => {
    try {
        const result = await createCategoryService(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                category: result?.category
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

const getCategoryByIdController = async (req, res) => {
    try {
        const result = await getCategoryByIdService(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                category: result?.category
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

const updateCategoryController = async (req, res) => {
    try {
        const result = await updateCategory(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                category: result?.category
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

const getAllCategoriesController = async (req, res) => {
    try {
        const result = await getAllCategoriesService(req);
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

const deleteCategoryController = async (req, res) => {
    try {
        const result = await deleteCategory(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                category: result?.category
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

const categoryController = { 
    createCategoryController,
    getCategoryByIdController,
    updateCategoryController,
    getAllCategoriesController,
    deleteCategoryController
}

export default categoryController;
