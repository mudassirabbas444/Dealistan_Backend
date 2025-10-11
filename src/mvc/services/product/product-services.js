import {
    createProduct,
    getProductById,
    findProductByIdAndUpdate,
    searchProducts,
    getAllProducts,
    getProductsBySeller,
    markProductAsSold,
    deleteProductById
} from "../../database/db.product.js";
import { validateProductImages, extractFilenameFromFirebaseUrl } from "../../../utils/firebaseValidation.js";
import { cleanupProductImages } from "../../../services/imageCleanup.js";

const createProductService=async(req)=>{
    try{
        if (!req.body.title || !req.body.description || !req.body.price) {
            return {
                success: false,
                message: "Title, description, and price are required",
                statusCode: 400
            };
        }
        const price = parseFloat(req.body.price);
        if (isNaN(price) || price <= 0) {
            return {
                success: false,
                message: "Price must be a valid positive number",
                statusCode: 400
            };
        }

        // Validate title length
        if (req.body.title.length < 3 || req.body.title.length > 100) {
            return {
                success: false,
                message: "Title must be between 3 and 100 characters",
                statusCode: 400
            };
        }

        // Validate description length
        if (req.body.description.length < 10 || req.body.description.length > 2000) {
            return {
                success: false,
                message: "Description must be between 10 and 2000 characters",
                statusCode: 400
            };
        }

        // Parse location data if it's a string
        let location = {};
        if (req.body.location) {
            try {
                location = typeof req.body.location === 'string' 
                    ? JSON.parse(req.body.location) 
                    : req.body.location;
            } catch (e) {
                // If parsing fails, use empty object
                location = {};
            }
        }

        // Parse tags if it's a string
        let tags = [];
        if (req.body.tags) {
            if (typeof req.body.tags === 'string') {
                tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            } else if (Array.isArray(req.body.tags)) {
                tags = req.body.tags;
            }
        }

        // Validate and process Firebase image URLs
        const imageValidation = validateProductImages(req.body.images);
        if (!imageValidation.isValid) {
            return {
                success: false,
                message: "Invalid image URLs",
                statusCode: 400,
                errors: imageValidation.errors
            };
        }

        const images = imageValidation.validUrls.map(imageUrl => ({
            url: imageUrl,
            public_id: extractFilenameFromFirebaseUrl(imageUrl)
        }));

        // Validate category
        if (!req.body.category) {
            return {
                success: false,
                message: "Category is required",
                statusCode: 400
            };
        }

        // Validate phone number
        if (!req.body.phoneNumber) {
            return {
                success: false,
                message: "Phone number is required",
                statusCode: 400
            };
        }

        // Add seller information from authenticated user
        const productData = {
            title: req.body.title.trim(),
            description: req.body.description.trim(),
            price: price,
            category: req.body.category,
            condition: req.body.condition || 'used',
            phoneNumber: req.body.phoneNumber.trim(),
            negotiable: req.body.negotiable === 'true' || req.body.negotiable === true,
            tags: tags,
            location: location,
            images: images,
            seller: req?.user?.id
        };
        
        const product=await createProduct(productData);
        if(product){
            return{
                success:true,
                message:"Product created successfully",
                statusCode:201,
                product:product
            }
        }
        else{
            return{
                success:false,
                message:"Failed to create product",
                statusCode:400,
                product:null
        }}
    
    }
        catch(error){
            return{
                 success: false,
                 statusCode: 500,
                 message: error.message,
            }
        }
    }
    const deleteProduct=async(req)=>{
        try{
            const productId=req?.query?.id;
            
            if (!productId) {
                return {
                    success: false,
                    message: "Product ID is required",
                    statusCode: 400
                };
            }

            // Get product first to cleanup images
            const productToDelete = await getProductById(productId);
            
            const product=await deleteProductById(productId);
             if(product){
                // Cleanup Firebase images
                if (productToDelete) {
                    await cleanupProductImages(productToDelete);
                }
                
                return{
                    success:true,
                    message:"Product deleted successfully",
                    statusCode:200,
                    product:product
                }
            }
            else{
                return{
                    success:false,
                    message:"Failed to delete product",
                    statusCode:400,
                    product:null
                }
            }
        }
        catch(error){
            return{
                success: false,
                statusCode: 500,
                message: error.message,
            }
        }
    }
const updateProduct=async(req)=>{
    try{
        const productId=req?.query?.id;
        const updateData=req?.body;
        const product=await findProductByIdAndUpdate(productId,updateData);
        if(product){
            return{
                success:true,
                message:"Product updated successfully",
                statusCode:200,
                product:product
            }
        }
        else{
            return{
                success:false,
                message:"Failed to update product",
                statusCode:400,
                product:null
        }}
    }
        catch(error){
            return{
                 success: false,
                    statusCode: 500,
                    message: error.message,
            }
        } 
    }

const getAllProductsService=async(req)=>{
    try{
        const options={
            page:req?.query?.page || 1,
            limit:req?.query?.limit || 20
        };
        const result=await getAllProducts(options);
        return{
            success:true,
            message:"Products fetched successfully",
            statusCode:200,
            data:result
        };
    }
    catch(error){
        return{
            success:false,
            statusCode:500,
            message:error.message
        };
    }
}

const getProductByIdService=async(req)=>{
    try{
        const productId=req?.query?.id;
        const product=await getProductById(productId);
        if(product){
            return{
                success:true,
                message:"Product fetched successfully",
                statusCode:200,
                product:product
            };
        }
        else{
            return{
                success:false,
                message:"Product not found",
                statusCode:404,
                product:null
            };
        }
    }
    catch(error){
        return{
            success:false,
            statusCode:500,
            message:error.message
        };
    }
}

const getProductsBySellerService=async(req)=>{
    try{
        const sellerId=req?.query?.sellerId || req?.user?.id;
        const options={
            page:req?.query?.page || 1,
            limit:req?.query?.limit || 20
        };
        const result=await getProductsBySeller(sellerId,options);
        return{
            success:true,
            message:"Seller products fetched successfully",
            statusCode:200,
            data:result
        };
    }
    catch(error){
        return{
            success:false,
            statusCode:500,
            message:error.message
        };
    }
}

const searchProductsService=async(req)=>{
    try{
        const filter={};
        if (req?.query?.category) filter.category = req.query.category;
        if (req?.query?.minPrice) {
            const mp = parseFloat(req.query.minPrice);
            if (!isNaN(mp)) filter.minPrice = mp;
        }
        if (req?.query?.maxPrice) {
            const mx = parseFloat(req.query.maxPrice);
            if (!isNaN(mx)) filter.maxPrice = mx;
        }
        if (req?.query?.keywords) filter.keywords = req.query.keywords;
        if (req?.query?.location) filter.location = req.query.location;
        if (req?.query?.condition) filter.condition = req.query.condition;
        if (req?.query?.seller) filter.seller = req.query.seller;
        const options={
            page:req?.query?.page || 1,
            limit:req?.query?.limit || 20
        };
        const result=await searchProducts(filter,options);
        return{
            success:true,
            message:"Search completed successfully",
            statusCode:200,
            data:result
        };
    }
    catch(error){
        return{
            success:false,
            statusCode:500,
            message:error.message
        };
    }
}

const markAsSoldService=async(req)=>{
    try{
        const productId=req?.query?.id;
        const product=await findProductByIdAndUpdate(productId,{status:"sold"});
        if(product){
            return{
                success:true,
                message:"Product marked as sold successfully",
                statusCode:200,
                product:product
            };
        }
        else{
            return{
                success:false,
                message:"Failed to mark product as sold",
                statusCode:400,
                product:null
            };
        }
    }
    catch(error){
        return{
            success:false,
            statusCode:500,
            message:error.message
        };
    }
}

export default{
    createProductService,
    getAllProductsService,
    getProductByIdService,
    getProductsBySellerService,
    updateProduct,
    deleteProduct,
    searchProductsService,
    markAsSoldService
}