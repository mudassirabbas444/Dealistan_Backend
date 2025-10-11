import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser = async (userData) => {
    try {
        const { password, ...otherData } = userData;
        
        // Hash password if provided (for regular registration)
        let hashedPassword = null;
        if (password) {
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(password, saltRounds);
        }
        
        const user = new User({
            ...otherData,
            ...(hashedPassword && { password: hashedPassword })
        });
        
        return await user.save();
    }
    catch(error) {
        throw new Error("Error creating user: " + error.message);
    }
}

export const getUserById = async (userId) => {
    try {
        return await User.findById(userId).select("-password");
    }
    catch(error) {
        throw new Error("Error fetching user: " + error.message);
    }
}

export const getUserByEmail = async (email) => {
    try {
        return await User.findOne({ email: email.toLowerCase() });
    }
    catch(error) {
        throw new Error("Error fetching user by email: " + error.message);
    }
}

export const findUserByIdAndUpdate = async (userId, updateData) => {
    try {
        // If password is being updated, hash it
        if (updateData.password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(updateData.password, saltRounds);
        }
        
        const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    catch(error) {
        throw new Error("Error updating user: " + error.message);
    }
}

export const getAllUsers = async (options) => {
    try {
        const page = parseInt(options.page) || 1;
        const limit = parseInt(options.limit) || 20;
        const skip = (page - 1) * limit;
        
        const users = await User.find({})
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
        
        const total = await User.countDocuments({});
        
        return {
            users,
            total,
            page,
            pages: Math.ceil(total / limit)
        };
    }
    catch(error) {
        throw new Error("Error fetching users: " + error.message);
    }
}

export const deleteUserById = async (userId) => {
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    catch(error) {
        throw new Error("Error deleting user: " + error.message);
    }
}

export const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    }
    catch(error) {
        throw new Error("Error comparing passwords: " + error.message);
    }
}

export const generateToken = (userId) => {
    try {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET || process.env.JWT_KEY || "fallback_secret", {
            expiresIn: "7d"
        });
    }
    catch(error) {
        throw new Error("Error generating token: " + error.message);
    }
}

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || process.env.JWT_KEY || "fallback_secret");
    }
    catch(error) {
        throw new Error("Error verifying token: " + error.message);
    }
}

// OTP related functions
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const saveOTP = async (userId, otp) => {
    try {
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        
        const user = await User.findByIdAndUpdate(userId, {
            otp,
            otpExpires
        }, { new: true }).select("-password");
        
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    catch(error) {
        throw new Error("Error saving OTP: " + error.message);
    }
}

export const verifyOTP = async (userId, otp) => {
    try {
        const user = await User.findById(userId);
        
        if (!user) {
            throw new Error("User not found");
        }
        
        if (!user.otp || !user.otpExpires) {
            throw new Error("No OTP found for this user");
        }
        
        if (new Date() > user.otpExpires) {
            throw new Error("OTP has expired");
        }
        
        if (user.otp !== otp) {
            throw new Error("Invalid OTP");
        }
        
        // Clear OTP and mark email as verified
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $unset: { otp: 1, otpExpires: 1 },
            emailVerified: true,
            verified: true
        }, { new: true }).select("-password");
        
        return updatedUser;
    }
    catch(error) {
        throw new Error("Error verifying OTP: " + error.message);
    }
}

export const resendOTP = async (userId) => {
    try {
        const user = await User.findById(userId);
        
        if (!user) {
            throw new Error("User not found");
        }
        
        if (user.emailVerified) {
            throw new Error("Email is already verified");
        }
        
        const otp = generateOTP();
        return await saveOTP(userId, otp);
    }
    catch(error) {
        throw new Error("Error resending OTP: " + error.message);
    }
}