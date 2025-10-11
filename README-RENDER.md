# Deploying to Render

## Quick Deploy

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `server` folder as root directory

2. **Configure Service**
   - **Name**: `dealistaan-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for better performance)

## Environment Variables

Set these in Render Dashboard → Environment:

### Required Variables
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dealistaan?retryWrites=true&w=majority
```

### Firebase Configuration
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project.iam.gserviceaccount.com
```

### Email Configuration
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### JWT Configuration
```
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d
```

### File Upload Configuration
```
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

## Database Setup

### Option 1: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster
3. Create database user
4. Get connection string
5. Add to `MONGODB_URI` environment variable

### Option 2: Render MongoDB
1. In Render Dashboard → "New" → "MongoDB"
2. Create new MongoDB instance
3. Copy connection string to `MONGODB_URI`

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Project Settings → Service Accounts
4. Generate new private key
5. Copy all Firebase environment variables

## Gmail Setup (for email service)

1. Enable 2FA on your Gmail account
2. Generate App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use app password in `EMAIL_PASS`

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Deploy on Render**
   - Render will automatically detect the `render.yaml` file
   - Or manually configure using the settings above

3. **Monitor Deployment**
   - Check build logs for errors
   - Verify environment variables are set
   - Test health endpoint: `https://your-app.onrender.com/api/health`

## Post-Deployment

### Test Your API
```bash
# Health check
curl https://your-app.onrender.com/api/health

# Test login
curl -X POST https://your-app.onrender.com/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Update Frontend
Update your frontend environment variables:
```env
REACT_APP_API_URL=https://your-app.onrender.com/api
```

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version compatibility
   - Verify all dependencies in package.json
   - Check build logs for specific errors

2. **App Crashes**
   - Verify all environment variables are set
   - Check MongoDB connection string
   - Verify Firebase credentials

3. **502 Bad Gateway**
   - App not binding to correct port (should use `process.env.PORT`)
   - Database connection issues
   - Missing environment variables

4. **CORS Errors**
   - Update CORS origin to your frontend domain
   - Verify credentials settings

### Logs
- View logs in Render Dashboard → Your Service → Logs
- Use `console.log()` for debugging
- Check both build and runtime logs

## Performance Tips

1. **Upgrade Plan**
   - Free tier has limitations
   - Consider paid plan for production

2. **Database Optimization**
   - Use MongoDB Atlas for better performance
   - Add database indexes

3. **Caching**
   - Implement Redis for session storage
   - Cache frequently accessed data

## Security

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong JWT secrets
   - Rotate credentials regularly

2. **CORS**
   - Restrict origins in production
   - Don't use `origin: "*"` in production

3. **Rate Limiting**
   - Implement rate limiting for API endpoints
   - Use middleware to prevent abuse

## Support

- [Render Documentation](https://render.com/docs)
- [Node.js on Render](https://render.com/docs/node)
- [MongoDB Atlas](https://docs.atlas.mongodb.com)
