
import { OAuth2Client } from 'google-auth-library';
import { getUserByEmail, createUser } from '../mvc/database/db.user.js';
import { generateToken } from '../mvc/database/db.user.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || process.env.REACT_APP_GOOGLE_CLIENT_ID);
export const verifyGoogleToken = async (idToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID || process.env.REACT_APP_GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    
    return {
      success: true,
      userInfo: {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        emailVerified: payload.email_verified
      }
    };
  } catch (error) {
    console.error('Error verifying Google token:', error);
    return {
      success: false,
      error: 'Invalid Google token'
    };
  }
};

export const authenticateWithGoogle = async (idToken) => {
  try {
    const tokenVerification = await verifyGoogleToken(idToken);
    
    if (!tokenVerification.success) {
      return {
        success: false,
        message: 'Invalid Google token',
        statusCode: 401
      };
    }

    const { userInfo } = tokenVerification;
    
    let user = await getUserByEmail(userInfo.email);
    
    if (user) {
      if (!user.googleId) {
        user.googleId = userInfo.googleId;
        user.avatar = userInfo.picture;
        user.emailVerified = userInfo.emailVerified;
        await user.save();
      }
      
      const token = generateToken(user._id);
      
      return {
        success: true,
        message: 'Login successful',
        statusCode: 200,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          verified: user.verified,
          emailVerified: user.emailVerified
        },
        token
      };
    } else {
      const newUserData = {
        name: userInfo.name,
        email: userInfo.email,
        googleId: userInfo.googleId,
        avatar: userInfo.picture,
        emailVerified: userInfo.emailVerified,
        verified: true, 
        role: 'user'
      };
      
      const newUser = await createUser(newUserData);
      
      if (newUser) {        
        const token = generateToken(newUser._id);
        
        return {
          success: true,
          message: 'Registration successful',
          statusCode: 201,
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
            role: newUser.role,
            verified: newUser.verified,
            emailVerified: newUser.emailVerified
          },
          token
        };
      } else {
        return {
          success: false,
          message: 'Failed to create user',
          statusCode: 500
        };
      }
    }
  } catch (error) {
    console.error('Error in Google authentication:', error);
    return {
      success: false,
      message: 'Authentication failed',
      statusCode: 500,
      error: error.message
    };
  }
};

export default {
  verifyGoogleToken,
  authenticateWithGoogle
};
