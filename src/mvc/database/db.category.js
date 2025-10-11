import Category from "../models/category.js";

export const createCategory = async (categoryData) => {
    try {
        const category = new Category(categoryData);
        return await category.save();
    }
    catch(error) {
        throw new Error("Error creating category: " + error.message);
    }
}

export const getCategoryById = async (categoryId) => {
    try {
        return await Category.findById(categoryId).populate("parentCategory");
    }
    catch(error) {
        throw new Error("Error fetching category: " + error.message);
    }
}

export const findCategoryByIdAndUpdate = async (categoryId, updateData) => {
    try {
        const category = await Category.findByIdAndUpdate(categoryId, updateData, { new: true }).populate("parentCategory");
        if (!category) {
            throw new Error("Category not found");
        }
        return category;
    }
    catch(error) {
        throw new Error("Error updating category: " + error.message);
    }
}

export const getAllCategories = async (options, filter = {}) => {
    try {
        const page = parseInt(options.page) || 1;
        const limit = parseInt(options.limit) || 20;
        const skip = (page - 1) * limit;
        
        const mongoFilter = { ...filter };

        const categories = await Category.find(mongoFilter)
        .populate("parentCategory")
        .populate("subcategories")
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit);
        
        const total = await Category.countDocuments(mongoFilter);
        
        return {
            categories,
            total,
            page,
            pages: Math.ceil(total / limit)
        };
    }
    catch(error) {
        throw new Error("Error fetching categories: " + error.message);
    }
}

export const deleteCategoryById = async (categoryId) => {
    try {
        const category = await Category.findByIdAndDelete(categoryId);
        if (!category) {
            throw new Error("Category not found");
        }
        return category;
    }
    catch(error) {
        throw new Error("Error deleting category: " + error.message);
    }
}

export const getCategoriesByParent = async (parentId) => {
    try {
        return await Category.find({ parentCategory: parentId }).populate("parentCategory");
    }
    catch(error) {
        throw new Error("Error fetching subcategories: " + error.message);
    }
}

export const getRootCategories = async () => {
    try {
        return await Category.find({ parentCategory: null }).populate("subcategories");
    }
    catch(error) {
        throw new Error("Error fetching root categories: " + error.message);
    }
}
