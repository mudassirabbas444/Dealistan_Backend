import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    city: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    verified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },

    // OTP Verification fields
    otp: { type: String },
    otpExpires: { type: Date },
    emailVerified: { type: Boolean, default: false },

    // Google OAuth fields
    googleId: { type: String, sparse: true },

    // Password reset fields
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    adsPosted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
