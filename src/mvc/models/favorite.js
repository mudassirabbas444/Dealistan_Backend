import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Product", 
      required: true 
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Create compound index to ensure uniqueness
favoriteSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);
