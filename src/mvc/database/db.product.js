import Product from "../models/product.js";

export const createProduct=async (productData) => {
    try{
    const product=new Product(productData)
    return await product.save();
    }
    catch(error){
        throw new Error("Error creating product: "+error.message);
    }
}

export const getProductById=async(productId)=>{
    try{
        return await Product.findById(productId).populate("category").populate("seller","-password -email -role"); 
    }
    catch(error){
        throw new Error("Error fetching product: "+error.message);
    }
}
export const findProductByIdAndUpdate=async(productId,updateData)=>{
    try{
        const product=await Product.findByIdAndUpdate(productId,updateData,{new:true});
        if(!product){
            throw new Error("Product not found");
        }
        return product;
    }
    catch(error){
        throw new Error("Error updating product: "+error.message);
    }
}
export const searchProducts=async(filter,options)=>{
    try{
        // Build query from provided filters
        const query={};
        // Only show approved products by default
        query.status = 'approved';
        if(filter.category){
            query.category=filter.category;
        }
        if(filter.minPrice || filter.maxPrice){
            query.price={};
            if(filter.minPrice){
                query.price.$gte=filter.minPrice;
            }
            if(filter.maxPrice){
                query.price.$lte=filter.maxPrice;
            }
        }
        if(filter.keywords){
            query.$or=[
                {title:{$regex:filter.keywords,$options:"i"}},
                {description:{$regex:filter.keywords,$options:"i"}}
            ];
        }
        if(filter.location){
            query["location.city"]=filter.location;
        }
        // Coordinate-based search/sort: lat, lon, optional radiusKm
        let useNearStage = false;
        if (typeof filter.lat === 'number' && typeof filter.lon === 'number') {
            useNearStage = true;
        }
        if(filter.condition){
            query.condition=filter.condition;
        }
        if(filter.seller){
            query.seller=filter.seller;
        }
        const page=parseInt(options.page) || 1;
        const limit=parseInt(options.limit) || 20;
        const skip=(page-1)*limit;
        if (!useNearStage) {
            // Default path: no coordinates provided → normal query sorted by createdAt
            const products=await Product.find(query)
            .populate("category")
            .populate("seller","-password -email -role")  
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit);
            const total=await Product.countDocuments(query);
            return {
                products,
                total,
                page,
                pages:Math.ceil(total/limit)
            };
        } else {
            // Use $geoNear for distance-based ordering, optionally limit by radius
            const radiusMeters = typeof filter.radiusKm === 'number' ? filter.radiusKm * 1000 : null;
            const pipeline = [];
            pipeline.push({
                $geoNear: {
                    near: { type: "Point", coordinates: [filter.lon, filter.lat] },
                    distanceField: "distance",
                    key: "location.geo",
                    spherical: true,
                    ...(radiusMeters ? { maxDistance: radiusMeters } : {})
                }
            });
            // Apply non-geo filters
            if (Object.keys(query).length > 0) {
                pipeline.push({ $match: query });
            }
            // Sorting: closest first already by $geoNear, then newest
            pipeline.push({ $sort: { distance: 1, createdAt: -1 } });
            // Pagination
            pipeline.push({ $skip: skip });
            pipeline.push({ $limit: limit });
            // Lookups to populate
            pipeline.push(
                { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'category' } },
            );
            pipeline.push({ $unwind: { path: '$category', preserveNullAndEmptyArrays: true } });
            pipeline.push(
                { $lookup: { from: 'users', localField: 'seller', foreignField: '_id', as: 'seller' } },
            );
            pipeline.push({ $unwind: { path: '$seller', preserveNullAndEmptyArrays: true } });

            const results = await Product.aggregate(pipeline);

            // Total count for pagination with same filters (without pagination stages)
            const countPipeline = [];
            countPipeline.push({
                $geoNear: {
                    near: { type: "Point", coordinates: [filter.lon, filter.lat] },
                    distanceField: "distance",
                    key: "location.geo",
                    spherical: true,
                    ...(radiusMeters ? { maxDistance: radiusMeters } : {})
                }
            });
            if (Object.keys(query).length > 0) {
                countPipeline.push({ $match: query });
            }
            countPipeline.push({ $count: 'total' });
            const totalDocs = await Product.aggregate(countPipeline);
            const total = totalDocs?.[0]?.total || 0;

            return {
                products: results,
                total,
                page,
                pages: Math.ceil(total/limit)
            };
        }
    }   
    catch(error){
        throw new Error("Error searching products: "+error.message);
    }
}

export const markProductAsSold=async(productId)=>{
    try{
        const product=await Product.findById(productId);  
        if(!product){
            throw new Error("Product not found");
        }   
        product.isSold=true;
        await product.save();
        return product;
    }   
    catch(error){   
        throw new Error("Error marking product as sold: "+error.message);
    }
}
export const toggleProductActiveStatus=async(productId,isActive)=>{
    try{
        const product=await Product.findById(productId);
        if(!product){
            throw new Error("Product not found");
        }   
        product.isActive=isActive;
        await product.save();
        return product;
    }
    catch(error){   
        throw new Error("Error updating product status: "+error.message);
    }
}

export const deleteProductById=async(productId)=>{
    try{
        const product=await Product.findByIdAndDelete(productId);  
        if(!product){
            throw new Error("Product not found");
        }   
        return product;
    }   
    catch(error){
        throw new Error("Error deleting product: "+error.message);
    }
}

export const incrementProductViews=async(productId)=>{
    try{
        const product=await Product.findById(productId);    
        if(!product){
            throw new Error("Product not found");
        }   
        product.views+=1;
        await product.save();
        return product;
    }
    catch(error){   
        throw new Error("Error incrementing product views: "+error.message);    
    }
}

export const getAllProducts=async(options)=>{
    try{
        const page=parseInt(options.page) || 1;
        const limit=parseInt(options.limit) || 20;
        const skip=(page-1)*limit;
        
        const products=await Product.find()
        .populate("category")
        .populate("seller","-password")
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit);
        
        const total=await Product.countDocuments();
        
        return {
            products,
            total,
            page,
            pages:Math.ceil(total/limit)
        };
    }
    catch(error){
        throw new Error("Error fetching products: "+error.message);
    }
}

export const getProductsBySeller=async(sellerId,options)=>{
    try{
        const page=parseInt(options.page) || 1;
        const limit=parseInt(options.limit) || 20;
        const skip=(page-1)*limit;
        
        const products=await Product.find({seller:sellerId})
        .populate("category")
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit);
        
        const total=await Product.countDocuments({seller:sellerId});
        
        return {
            products,
            total,
            page,
            pages:Math.ceil(total/limit)
        };
    }
    catch(error){
        throw new Error("Error fetching seller products: "+error.message);
    }
}
