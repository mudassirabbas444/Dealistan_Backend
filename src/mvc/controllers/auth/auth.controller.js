

import { authenticateWithGoogle } from '../../../services/googleAuth.js';
import { sendPasswordResetEmail, resetPassword } from '../../../services/passwordReset.js';

export const googleAuthController = async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required'
      });
    }

    const result = await authenticateWithGoogle(idToken);
    
    res.status(result.statusCode).json(result);
  } catch (error) {
    console.error('Google auth controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const result = await sendPasswordResetEmail(req);
    res.status(result.statusCode).json(result);
  } catch (error) {
    console.error('Forgot password controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
export const resetPasswordController = async (req, res) => {
  try {
    const result = await resetPassword(req);
    res.status(result.statusCode).json(result);
  } catch (error) {
    console.error('Reset password controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export default {
  googleAuthController,
  forgotPasswordController,
  resetPasswordController
};
