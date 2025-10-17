import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },

    condition: {
      type: String,
      enum: ["new", "used", "refurbished"],
      default: "used",
    },

    images: [
      {
        url: String,       
        public_id: String,
      },
    ],

    location: {
      city: String,
      area: String,
      address: String,
      // Lat/Lon kept for readability
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
      // GeoJSON point for geo queries
      geo: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          index: '2dsphere'
        }
      }
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "sold"],
      default: "approved",
    },

    tags: [String],

    negotiable: {
      type: Boolean,
      default: false,
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },

    expiryDate: {
      type: Date, 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
