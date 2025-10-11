import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let userId = '';
let productId = '';
let categoryId = '';
let messageId = '';

// Generate unique identifiers for each test run
const testId = Date.now();
const testEmail = `test${testId}@example.com`;
const testPhone = `1234567${testId.toString().slice(-3)}`;

// Helper function to make API requests
const makeRequest = async (method, endpoint, data = null, token = null) => {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = {
        method,
        headers,
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return { status: response.status, data: result };
    } catch (error) {
        return { status: 500, data: { error: error.message } };
    }
};

// Test functions
const testUserEndpoints = async () => {
    console.log('\n🔵 Testing User Endpoints...\n');
    
    // Test user registration
    console.log('1. Testing user registration...');
    const registerData = {
        name: 'Test User',
        email: testEmail,
        phone: testPhone,
        password: 'password123',
        city: 'Test City'
    };
    
    const registerResult = await makeRequest('POST', '/users/register', registerData);
    console.log('Register Status:', registerResult.status);
    console.log('Register Response:', registerResult.data);
    
    if (registerResult.data.success) {
        authToken = registerResult.data.token;
        userId = registerResult.data.user.id;
        console.log('✅ User registered successfully, token saved');
    } else {
        console.log('❌ User registration failed');
        return false;
    }
    
    // Test user login
    console.log('\n2. Testing user login...');
    const loginData = {
        email: testEmail,
        password: 'password123'
    };
    
    const loginResult = await makeRequest('POST', '/users/login', loginData);
    console.log('Login Status:', loginResult.status);
    console.log('Login Response:', loginResult.data);
    
    if (loginResult.data.success) {
        console.log('✅ User login successful');
    } else {
        console.log('❌ User login failed');
    }
    
    // Test get user profile
    console.log('\n3. Testing get user profile...');
    const profileResult = await makeRequest('GET', '/users/profile', null, authToken);
    console.log('Profile Status:', profileResult.status);
    console.log('Profile Response:', profileResult.data);
    
    if (profileResult.data.success) {
        console.log('✅ User profile retrieved successfully');
    } else {
        console.log('❌ User profile retrieval failed');
    }
    
    // Test update user profile
    console.log('\n4. Testing update user profile...');
    const updateData = {
        city: 'Updated City',
        name: 'Updated Test User'
    };
    
    const updateResult = await makeRequest('PUT', '/users/update-profile', updateData, authToken);
    console.log('Update Status:', updateResult.status);
    console.log('Update Response:', updateResult.data);
    
    if (updateResult.data.success) {
        console.log('✅ User profile updated successfully');
    } else {
        console.log('❌ User profile update failed');
    }
    
    // Test get all users
    console.log('\n5. Testing get all users...');
    const allUsersResult = await makeRequest('GET', '/users/?page=1&limit=10', null, authToken);
    console.log('All Users Status:', allUsersResult.status);
    console.log('All Users Response:', allUsersResult.data);
    
    if (allUsersResult.data.success) {
        console.log('✅ All users retrieved successfully');
    } else {
        console.log('❌ All users retrieval failed');
    }
    
    return true;
};

const testCategoryEndpoints = async () => {
    console.log('\n🟢 Testing Category Endpoints...\n');
    
    // Test create category
    console.log('1. Testing create category...');
    const categoryData = {
        name: `Electronics ${testId}`,
        slug: `electronics-${testId}`,
        description: 'Electronic items and gadgets',
        icon: 'electronics-icon.png',
        isActive: true,
        order: 1
    };
    
    const createResult = await makeRequest('POST', '/categories/add-category', categoryData, authToken);
    console.log('Create Category Status:', createResult.status);
    console.log('Create Category Response:', createResult.data);
    
    if (createResult.data.success) {
        categoryId = createResult.data.category._id;
        console.log('✅ Category created successfully');
    } else {
        console.log('❌ Category creation failed');
        return false;
    }
    
    // Test get all categories
    console.log('\n2. Testing get all categories...');
    const allCategoriesResult = await makeRequest('GET', '/categories/?page=1&limit=10');
    console.log('All Categories Status:', allCategoriesResult.status);
    console.log('All Categories Response:', allCategoriesResult.data);
    
    if (allCategoriesResult.data.success) {
        console.log('✅ All categories retrieved successfully');
    } else {
        console.log('❌ All categories retrieval failed');
    }
    
    // Test get category by ID
    console.log('\n3. Testing get category by ID...');
    const categoryResult = await makeRequest('GET', `/categories/get-category?id=${categoryId}`);
    console.log('Category Status:', categoryResult.status);
    console.log('Category Response:', categoryResult.data);
    
    if (categoryResult.data.success) {
        console.log('✅ Category retrieved successfully');
    } else {
        console.log('❌ Category retrieval failed');
    }
    
    // Test update category
    console.log('\n4. Testing update category...');
    const updateData = {
        name: 'Updated Electronics',
        description: 'Updated electronic items and gadgets'
    };
    
    const updateResult = await makeRequest('PUT', `/categories/update-category?id=${categoryId}`, updateData, authToken);
    console.log('Update Category Status:', updateResult.status);
    console.log('Update Category Response:', updateResult.data);
    
    if (updateResult.data.success) {
        console.log('✅ Category updated successfully');
    } else {
        console.log('❌ Category update failed');
    }
    
    return true;
};

const testProductEndpoints = async () => {
    console.log('\n🟡 Testing Product Endpoints...\n');
    
    // Test create product
    console.log('1. Testing create product...');
    const productData = {
        title: `Test Product ${testId}`,
        description: 'This is a test product description',
        price: 100,
        category: categoryId,
        seller: userId,
        condition: 'new',
        images: [
            {
                url: 'https://example.com/image1.jpg',
                public_id: 'test_image_1'
            }
        ],
        location: {
            city: 'Test City',
            area: 'Test Area',
            address: '123 Test Street'
        },
        phoneNumber: '1234567890',
        negotiable: true,
        tags: ['test', 'product']
    };
    
    const createResult = await makeRequest('POST', '/products/add-product', productData, authToken);
    console.log('Create Product Status:', createResult.status);
    console.log('Create Product Response:', createResult.data);
    
    if (createResult.data.success) {
        productId = createResult.data.product._id;
        console.log('✅ Product created successfully');
    } else {
        console.log('❌ Product creation failed');
        return false;
    }
    
    // Test get all products
    console.log('\n2. Testing get all products...');
    const allProductsResult = await makeRequest('GET', '/products/?page=1&limit=10', null, authToken);
    console.log('All Products Status:', allProductsResult.status);
    console.log('All Products Response:', allProductsResult.data);
    
    if (allProductsResult.data.success) {
        console.log('✅ All products retrieved successfully');
    } else {
        console.log('❌ All products retrieval failed');
    }
    
    // Test get product by ID
    console.log('\n3. Testing get product by ID...');
    const productResult = await makeRequest('GET', `/products/get-product?id=${productId}`, null, authToken);
    console.log('Product Status:', productResult.status);
    console.log('Product Response:', productResult.data);
    
    if (productResult.data.success) {
        console.log('✅ Product retrieved successfully');
    } else {
        console.log('❌ Product retrieval failed');
    }
    
    // Test get products by seller
    console.log('\n4. Testing get products by seller...');
    const sellerProductsResult = await makeRequest('GET', `/products/get-products-by-seller?sellerId=${userId}`, null, authToken);
    console.log('Seller Products Status:', sellerProductsResult.status);
    console.log('Seller Products Response:', sellerProductsResult.data);
    
    if (sellerProductsResult.data.success) {
        console.log('✅ Seller products retrieved successfully');
    } else {
        console.log('❌ Seller products retrieval failed');
    }
    
    // Test search products
    console.log('\n5. Testing search products...');
    const searchResult = await makeRequest('GET', '/products/search-products?keywords=test&category=electronics', null, authToken);
    console.log('Search Status:', searchResult.status);
    console.log('Search Response:', searchResult.data);
    
    if (searchResult.data.success) {
        console.log('✅ Product search successful');
    } else {
        console.log('❌ Product search failed');
    }
    
    // Test update product
    console.log('\n6. Testing update product...');
    const updateData = {
        title: 'Updated Test Product',
        description: 'This is an updated test product description'
    };
    
    const updateResult = await makeRequest('PUT', `/products/update-product?id=${productId}`, updateData, authToken);
    console.log('Update Product Status:', updateResult.status);
    console.log('Update Product Response:', updateResult.data);
    
    if (updateResult.data.success) {
        console.log('✅ Product updated successfully');
    } else {
        console.log('❌ Product update failed');
    }
    
    return true;
};

const testMessageEndpoints = async () => {
    console.log('\n🟣 Testing Message Endpoints...\n');
    
    // Test send message
    console.log('1. Testing send message...');
    const messageData = {
        receiver: userId, // Sending to self for test
        product: productId,
        content: 'Is this product still available?'
    };
    
    const sendResult = await makeRequest('POST', '/messages/send-message', messageData, authToken);
    console.log('Send Message Status:', sendResult.status);
    console.log('Send Message Response:', sendResult.data);
    
    if (sendResult.data.success) {
        messageId = sendResult.data.message._id;
        console.log('✅ Message sent successfully');
    } else {
        console.log('❌ Message sending failed');
        return false;
    }
    
    // Test get messages between users
    console.log('\n2. Testing get messages between users...');
    const messagesResult = await makeRequest('GET', `/messages/get-messages-between-users?userId=${userId}&page=1&limit=10`, null, authToken);
    console.log('Messages Status:', messagesResult.status);
    console.log('Messages Response:', messagesResult.data);
    
    if (messagesResult.data.success) {
        console.log('✅ Messages between users retrieved successfully');
    } else {
        console.log('❌ Messages between users retrieval failed');
    }
    
    // Test get messages by product
    console.log('\n3. Testing get messages by product...');
    const productMessagesResult = await makeRequest('GET', `/messages/get-messages-by-product?productId=${productId}&page=1&limit=10`, null, authToken);
    console.log('Product Messages Status:', productMessagesResult.status);
    console.log('Product Messages Response:', productMessagesResult.data);
    
    if (productMessagesResult.data.success) {
        console.log('✅ Product messages retrieved successfully');
    } else {
        console.log('❌ Product messages retrieval failed');
    }
    
    // Test get unread count
    console.log('\n4. Testing get unread count...');
    const unreadResult = await makeRequest('GET', '/messages/get-unread-count', null, authToken);
    console.log('Unread Count Status:', unreadResult.status);
    console.log('Unread Count Response:', unreadResult.data);
    
    if (unreadResult.data.success) {
        console.log('✅ Unread count retrieved successfully');
    } else {
        console.log('❌ Unread count retrieval failed');
    }
    
    // Test get user conversations
    console.log('\n5. Testing get user conversations...');
    const conversationsResult = await makeRequest('GET', '/messages/get-conversations?page=1&limit=10', null, authToken);
    console.log('Conversations Status:', conversationsResult.status);
    console.log('Conversations Response:', conversationsResult.data);
    
    if (conversationsResult.data.success) {
        console.log('✅ User conversations retrieved successfully');
    } else {
        console.log('❌ User conversations retrieval failed');
    }
    
    // Test mark as read
    console.log('\n6. Testing mark as read...');
    const markReadResult = await makeRequest('PATCH', `/messages/mark-as-read?senderId=${userId}`, null, authToken);
    console.log('Mark as Read Status:', markReadResult.status);
    console.log('Mark as Read Response:', markReadResult.data);
    
    if (markReadResult.data.success) {
        console.log('✅ Messages marked as read successfully');
    } else {
        console.log('❌ Messages mark as read failed');
    }
    
    return true;
};

const testCleanup = async () => {
    console.log('\n🧹 Testing Cleanup (Delete Operations)...\n');
    
    // Test delete message
    if (messageId) {
        console.log('1. Testing delete message...');
        const deleteMessageResult = await makeRequest('DELETE', `/messages/delete-message?id=${messageId}`, null, authToken);
        console.log('Delete Message Status:', deleteMessageResult.status);
        console.log('Delete Message Response:', deleteMessageResult.data);
        
        if (deleteMessageResult.data.success) {
            console.log('✅ Message deleted successfully');
        } else {
            console.log('❌ Message deletion failed');
        }
    }
    
    // Test mark product as sold
    if (productId) {
        console.log('\n2. Testing mark product as sold...');
        const markSoldResult = await makeRequest('PATCH', `/products/mark-sold?id=${productId}`, null, authToken);
        console.log('Mark as Sold Status:', markSoldResult.status);
        console.log('Mark as Sold Response:', markSoldResult.data);
        
        if (markSoldResult.data.success) {
            console.log('✅ Product marked as sold successfully');
        } else {
            console.log('❌ Product mark as sold failed');
        }
    }
    
    // Test delete product
    if (productId) {
        console.log('\n3. Testing delete product...');
        const deleteProductResult = await makeRequest('DELETE', `/products/delete-product?id=${productId}`, null, authToken);
        console.log('Delete Product Status:', deleteProductResult.status);
        console.log('Delete Product Response:', deleteProductResult.data);
        
        if (deleteProductResult.data.success) {
            console.log('✅ Product deleted successfully');
        } else {
            console.log('❌ Product deletion failed');
        }
    }
    
    // Test delete category
    if (categoryId) {
        console.log('\n4. Testing delete category...');
        const deleteCategoryResult = await makeRequest('DELETE', `/categories/delete-category?id=${categoryId}`, null, authToken);
        console.log('Delete Category Status:', deleteCategoryResult.status);
        console.log('Delete Category Response:', deleteCategoryResult.data);
        
        if (deleteCategoryResult.data.success) {
            console.log('✅ Category deleted successfully');
        } else {
            console.log('❌ Category deletion failed');
        }
    }
    
    // Test delete user
    if (userId) {
        console.log('\n5. Testing delete user...');
        const deleteUserResult = await makeRequest('DELETE', `/users/delete-user?id=${userId}`, null, authToken);
        console.log('Delete User Status:', deleteUserResult.status);
        console.log('Delete User Response:', deleteUserResult.data);
        
        if (deleteUserResult.data.success) {
            console.log('✅ User deleted successfully');
        } else {
            console.log('❌ User deletion failed');
        }
    }
};

const testServerConnection = async () => {
    console.log('🔍 Testing server connection...');
    try {
        const response = await fetch('http://localhost:5000');
        const text = await response.text();
        if (response.status === 200 && text.includes('Hello from server')) {
            console.log('✅ Server is running and accessible');
            return true;
        } else {
            console.log('❌ Server connection failed');
            console.log('Response:', { status: response.status, text });
            return false;
        }
    } catch (error) {
        console.log('❌ Server connection failed');
        console.log('Error:', error.message);
        return false;
    }
};

// Main test function
const runAllTests = async () => {
    console.log('🚀 Starting API Endpoint Tests...\n');
    console.log('='.repeat(50));
    
    try {
        // Test server connection
        const serverRunning = await testServerConnection();
        if (!serverRunning) {
            console.log('\n❌ Server is not running. Please start the server first.');
            return;
        }
        
        // Test user endpoints
        const userTestsPassed = await testUserEndpoints();
        if (!userTestsPassed) {
            console.log('\n❌ User tests failed. Stopping further tests.');
            return;
        }
        
        // Test category endpoints
        const categoryTestsPassed = await testCategoryEndpoints();
        if (!categoryTestsPassed) {
            console.log('\n❌ Category tests failed. Stopping further tests.');
            return;
        }
        
        // Test product endpoints
        const productTestsPassed = await testProductEndpoints();
        if (!productTestsPassed) {
            console.log('\n❌ Product tests failed. Stopping further tests.');
            return;
        }
        
        // Test message endpoints
        const messageTestsPassed = await testMessageEndpoints();
        if (!messageTestsPassed) {
            console.log('\n❌ Message tests failed. Stopping further tests.');
            return;
        }
        
        // Test cleanup operations
        await testCleanup();
        
        console.log('\n🎉 All tests completed successfully!');
        console.log('='.repeat(50));
        
    } catch (error) {
        console.error('\n❌ Test execution failed:', error);
    }
};

// Run tests if this file is executed directly
runAllTests();

export { runAllTests };
