# API Testing Guide

This document explains how to test all the API endpoints for the Dealistaan application.

## Prerequisites

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   Create a `.env` file in the server directory with:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_KEY=your_jwt_secret_key
   ```

3. **Start the Server**
   ```bash
   npm run dev
   # or
   npm start
   ```

## Running Tests

### Automated Testing
Run the comprehensive test script:
```bash
npm test
# or
npm run test:endpoints
```

### Manual Testing
You can also test individual endpoints using tools like Postman, Insomnia, or curl.

## Test Coverage

The test script covers all API endpoints:

### 🔵 User Endpoints
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/update-profile` - Update user profile
- `GET /api/users/` - Get all users
- `DELETE /api/users/delete-user?id=123` - Delete user

### 🟢 Category Endpoints
- `POST /api/categories/add-category` - Create category
- `GET /api/categories/` - Get all categories
- `GET /api/categories/get-category?id=123` - Get category by ID
- `PUT /api/categories/update-category?id=123` - Update category
- `DELETE /api/categories/delete-category?id=123` - Delete category

### 🟡 Product Endpoints
- `POST /api/products/add-product` - Create product
- `GET /api/products/` - Get all products
- `GET /api/products/get-product?id=123` - Get product by ID
- `GET /api/products/get-products-by-seller?sellerId=123` - Get products by seller
- `GET /api/products/search-products?keywords=test` - Search products
- `PUT /api/products/update-product?id=123` - Update product
- `DELETE /api/products/delete-product?id=123` - Delete product
- `PATCH /api/products/mark-sold?id=123` - Mark product as sold

### 🟣 Message Endpoints
- `POST /api/messages/send-message` - Send message
- `GET /api/messages/get-messages-between-users?userId=123` - Get conversation
- `GET /api/messages/get-messages-by-product?productId=123` - Get product messages
- `DELETE /api/messages/delete-message?id=123` - Delete message
- `PATCH /api/messages/mark-as-read?senderId=123` - Mark as read
- `GET /api/messages/get-unread-count` - Get unread count
- `GET /api/messages/get-conversations` - Get user conversations

## Test Flow

The test script follows this sequence:

1. **Server Connection Test** - Verifies server is running
2. **User Tests** - Registration, login, profile management
3. **Category Tests** - Category CRUD operations
4. **Product Tests** - Product CRUD operations
5. **Message Tests** - Message operations
6. **Cleanup Tests** - Delete operations

## Sample Test Data

The test script creates sample data:

### User
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "1234567890",
  "password": "password123",
  "city": "Test City"
}
```

### Category
```json
{
  "name": "Electronics",
  "slug": "electronics",
  "description": "Electronic items and gadgets",
  "icon": "electronics-icon.png",
  "isActive": true,
  "order": 1
}
```

### Product
```json
{
  "title": "Test Product",
  "description": "This is a test product description",
  "price": 100,
  "category": "category_id",
  "condition": "new",
  "images": [{"url": "https://example.com/image1.jpg", "public_id": "test_image_1"}],
  "location": {
    "city": "Test City",
    "area": "Test Area",
    "address": "123 Test Street"
  },
  "phoneNumber": "1234567890",
  "negotiable": true,
  "tags": ["test", "product"]
}
```

### Message
```json
{
  "receiver": "user_id",
  "product": "product_id",
  "content": "Is this product still available?"
}
```

## Authentication

Most endpoints require authentication. The test script:

1. Registers a user and gets an auth token
2. Uses the token for all authenticated requests
3. Passes the token in the `Authorization` header as `Bearer <token>`

## Error Handling

The test script includes error handling for:
- Network connection issues
- Authentication failures
- Invalid data
- Server errors

## Expected Output

When tests pass, you'll see:
```
🚀 Starting API Endpoint Tests...

🔍 Testing server connection...
✅ Server is running and accessible

🔵 Testing User Endpoints...
✅ User registered successfully, token saved
✅ User login successful
✅ User profile retrieved successfully
✅ User profile updated successfully
✅ All users retrieved successfully

🟢 Testing Category Endpoints...
✅ Category created successfully
✅ All categories retrieved successfully
✅ Category retrieved successfully
✅ Category updated successfully

🟡 Testing Product Endpoints...
✅ Product created successfully
✅ All products retrieved successfully
✅ Product retrieved successfully
✅ Seller products retrieved successfully
✅ Product search successful
✅ Product updated successfully

🟣 Testing Message Endpoints...
✅ Message sent successfully
✅ Messages between users retrieved successfully
✅ Product messages retrieved successfully
✅ Unread count retrieved successfully
✅ User conversations retrieved successfully
✅ Messages marked as read successfully

🧹 Testing Cleanup (Delete Operations)...
✅ Message deleted successfully
✅ Product marked as sold successfully
✅ Product deleted successfully
✅ Category deleted successfully
✅ User deleted successfully

🎉 All tests completed successfully!
```

## Troubleshooting

### Common Issues

1. **Server not running**
   - Make sure MongoDB is running
   - Check if PORT 5000 is available
   - Verify environment variables

2. **Authentication errors**
   - Check JWT_KEY in environment variables
   - Verify token is being passed correctly

3. **Database connection issues**
   - Verify MONGO_URI is correct
   - Check MongoDB server status

4. **Import errors**
   - Make sure all dependencies are installed
   - Check Node.js version compatibility

### Debug Mode

To run tests with more verbose output, modify the test script to include additional logging.

## Contributing

When adding new endpoints:

1. Add the endpoint to the appropriate test function
2. Include both success and failure scenarios
3. Add cleanup operations if needed
4. Update this documentation

## Notes

- Tests are designed to be run in sequence
- Each test depends on the previous ones
- Test data is automatically cleaned up
- Tests can be run multiple times safely
