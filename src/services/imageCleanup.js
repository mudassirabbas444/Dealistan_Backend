import { validateFirebaseUrls, extractFilenameFromFirebaseUrl } from '../utils/firebaseValidation.js';

export const cleanupProductImages = async (product) => {
  try {
    if (!product || !product.images || !Array.isArray(product.images)) {
      return {
        success: true,
        message: 'No images to cleanup',
        cleanedImages: []
      };
    }

    const imageUrls = product.images.map(img => img.url).filter(Boolean);
    
    if (imageUrls.length === 0) {
      return {
        success: true,
        message: 'No valid image URLs found',
        cleanedImages: []
      };
    }
    const urlValidation = validateFirebaseUrls(imageUrls);
    
    if (!urlValidation.isValid) {
      console.warn('Some product images have invalid Firebase URLs:', urlValidation.errors);
    }

    const imageFilenames = urlValidation.validUrls.map(url => extractFilenameFromFirebaseUrl(url));
    
    console.log(`Product ${product._id} deleted. Images to cleanup:`, imageFilenames);
    
    return {
      success: true,
      message: `Cleaned up ${imageFilenames.length} images`,
      cleanedImages: imageFilenames
    };
  } catch (error) {
    console.error('Error during image cleanup:', error);
    return {
      success: false,
      message: 'Failed to cleanup images',
      error: error.message
    };
  }
};
export const cleanupUserAvatar = async (user) => {
  try {
    if (!user || !user.avatar) {
      return {
        success: true,
        message: 'No avatar to cleanup',
        cleanedAvatar: null
      };
    }

    const { validateFirebaseUrls } = await import('../utils/firebaseValidation.js');
    const urlValidation = validateFirebaseUrls([user.avatar]);
    
    if (!urlValidation.isValid) {
      console.warn('User avatar has invalid Firebase URL:', user.avatar);
      return {
        success: true,
        message: 'Invalid avatar URL, no cleanup needed',
        cleanedAvatar: null
      };
    }

    const avatarFilename = extractFilenameFromFirebaseUrl(user.avatar);
    
    console.log(`User ${user._id} deleted. Avatar to cleanup:`, avatarFilename);
    
    return {
      success: true,
      message: 'Avatar cleaned up successfully',
      cleanedAvatar: avatarFilename
    };
  } catch (error) {
    console.error('Error during avatar cleanup:', error);
    return {
      success: false,
      message: 'Failed to cleanup avatar',
      error: error.message
    };
  }
};
export const validateAndSanitizeImageData = (imageData) => {
  try {
    if (!imageData) {
      return {
        isValid: false,
        errors: ['Image data is required']
      };
    }

    const errors = [];
    const sanitizedData = {};

    if (imageData.url) {
      const { validateFirebaseUrls } = require('../utils/firebaseValidation.js');
      const urlValidation = validateFirebaseUrls([imageData.url]);
      
      if (!urlValidation.isValid) {
        errors.push('Invalid Firebase Storage URL');
      } else {
        sanitizedData.url = urlValidation.validUrls[0];
      }
    }

    if (imageData.public_id) {
      sanitizedData.public_id = imageData.public_id.trim();
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData
    };
  } catch (error) {
    return {
      isValid: false,
      errors: ['Error validating image data'],
      error: error.message
    };
  }
};

export default {
  cleanupProductImages,
  cleanupUserAvatar,
  validateAndSanitizeImageData
};
