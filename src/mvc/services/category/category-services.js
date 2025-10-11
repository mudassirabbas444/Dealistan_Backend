import {
    createCategory,
    getCategoryById,
    findCategoryByIdAndUpdate,
    getAllCategories,
    deleteCategoryById
} from "../../database/db.category.js";

const createCategoryService = async (req) => {
    try {
        const body = req?.body || {};
        const name = String(body.name || '').trim();
        const rawSlug = String(body.slug || name).trim().toLowerCase();
        const slug = rawSlug
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        const description = String(body.description || '').trim();
        const isActive = Boolean(body.isActive !== false);
        const order = Number.isFinite(Number(body.order)) ? Number(body.order) : 0;
        const rawParent = body.parentCategory;
        const isValidObjectId = (v) => typeof v === 'string' && /^[a-fA-F0-9]{24}$/.test(v);
        const parentCategory = (rawParent === 'null' || rawParent === '' || rawParent === null)
            ? null
            : (isValidObjectId(rawParent) ? rawParent : undefined);

        if (rawParent && rawParent !== 'null' && rawParent !== '' && !isValidObjectId(rawParent)) {
            return {
                success: false,
                message: "Invalid parentCategory id",
                statusCode: 400,
                category: null
            };
        }

        if (!name || !slug) {
            return {
                success: false,
                message: "Name and slug are required",
                statusCode: 400,
                category: null
            };
        }

        const categoryPayload = { name, slug, description, isActive, order };
        if (typeof parentCategory !== 'undefined') categoryPayload.parentCategory = parentCategory;
        const category = await createCategory(categoryPayload);
        if (category) {
            return {
                success: true,
                message: "Category created successfully",
                statusCode: 201,
                category: category
            };
        } else {
            return {
                success: false,
                message: "Failed to create category",
                statusCode: 400,
                category: null
            };
        }
    }
    catch(error) {
        const isDuplicate = /duplicate key/i.test(error.message) || error.code === 11000;
        return {
            success: false,
            statusCode: isDuplicate ? 409 : 500,
            message: isDuplicate ? 'Category with same name or slug already exists' : error.message
        };
    }
}

const getCategoryByIdService = async (req) => {
    try {
        const categoryId = req?.query?.id;
        const category = await getCategoryById(categoryId);
        if (category) {
            return {
                success: true,
                message: "Category fetched successfully",
                statusCode: 200,
                category: category
            };
        } else {
            return {
                success: false,
                message: "Category not found",
                statusCode: 404,
                category: null
            };
        }
    }
    catch(error) {
        return {
            success: false,
            statusCode: 500,
            message: error.message
        };
    }
}

const updateCategory = async (req) => {
    try {
        const categoryId = req?.query?.id;
        const updateData = req?.body;
        const category = await findCategoryByIdAndUpdate(categoryId, updateData);
        if (category) {
            return {
                success: true,
                message: "Category updated successfully",
                statusCode: 200,
                category: category
            };
        } else {
            return {
                success: false,
                message: "Failed to update category",
                statusCode: 400,
                category: null
            };
        }
    }
    catch(error) {
        return {
            success: false,
            statusCode: 500,
            message: error.message
        };
    }
}

const getAllCategoriesService = async (req) => {
    try {
        const options = {
            page: req?.query?.page || 1,
            limit: req?.query?.limit || 20
        };
        // Build filters
        const filter = {};
        if (typeof req?.query?.isActive !== 'undefined') {
            filter.isActive = req.query.isActive === 'true' || req.query.isActive === true;
        }
        if (typeof req?.query?.parentCategory !== 'undefined') {
            // null or specific id
            if (req.query.parentCategory === 'null') {
                filter.parentCategory = null;
            } else {
                filter.parentCategory = req.query.parentCategory;
            }
        }
        const result = await getAllCategories(options, filter);
        return {
            success: true,
            message: "Categories fetched successfully",
            statusCode: 200,
            data: result
        };
    }
    catch(error) {
        return {
            success: false,
            statusCode: 500,
            message: error.message
        };
    }
}

const deleteCategory = async (req) => {
    try {
        const categoryId = req?.query?.id;
        const category = await deleteCategoryById(categoryId);
        if (category) {
            return {
                success: true,
                message: "Category deleted successfully",
                statusCode: 200,
                category: category
            };
        } else {
            return {
                success: false,
                message: "Failed to delete category",
                statusCode: 400,
                category: null
            };
        }
    }
    catch(error) {
        return {
            success: false,
            statusCode: 500,
            message: error.message
        };
    }
}

export default {
    createCategoryService,
    getCategoryByIdService,
    updateCategory,
    getAllCategoriesService,
    deleteCategory
}
