import { 
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsersService,
    deleteUser,
    verifyOTPService,
    resendOTPService
} from "../../services/user/index.js";

const registerUserController = async (req, res) => {
    try {
        const result = await registerUser(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                user: result?.user,
                token: result?.token
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

const loginUserController = async (req, res) => {
    try {
        const result = await loginUser(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                user: result?.user,
                token: result?.token
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

const getUserProfileController = async (req, res) => {
    try {
        const result = await getUserProfile(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                user: result?.user
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

const updateUserProfileController = async (req, res) => {
    try {
        const result = await updateUserProfile(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                user: result?.user
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

const getAllUsersController = async (req, res) => {
    try {
        const result = await getAllUsersService(req);
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

const deleteUserController = async (req, res) => {
    try {
        const result = await deleteUser(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                user: result?.user
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

const verifyOTPController = async (req, res) => {
    try {
        const result = await verifyOTPService(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                message: result?.message,
                user: result?.user
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

const resendOTPController = async (req, res) => {
    try {
        const result = await resendOTPService(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                message: result?.message
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

const userController = { 
    registerUserController,
    loginUserController,
    getUserProfileController,
    updateUserProfileController,
    getAllUsersController,
    deleteUserController,
    verifyOTPController,
    resendOTPController
}

export default userController;
