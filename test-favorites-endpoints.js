// Test script for favorites endpoints
// Run with: node test-favorites-endpoints.js

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

// Helper function to make API requests
async function makeRequest(endpoint, method = 'GET', body = null, token = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    console.log(`${method} ${endpoint}`);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    console.log('---');
    
    return { response, data };
  } catch (error) {
    console.error(`Error making ${method} request to ${endpoint}:`, error);
    return { response: null, data: null };
  }
}

// Test user registration and login
async function setupTestUser() {
  console.log('=== Setting up test user ===');
  
  // Register a test user
  const registerData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    password: 'password123',
    city: 'Test City'
  };

  const registerResponse = await makeRequest('/users/register', 'POST', registerData);
  
  if (registerResponse.data?.success) {
    console.log('User registered successfully');
  } else {
    console.log('User might already exist, trying to login...');
  }

  // Login to get auth token
  const loginData = {
    email: 'test@example.com',
    password: 'password123'
  };

  const loginResponse = await makeRequest('/users/login', 'POST', loginData);
  
  if (loginResponse.data?.success && loginResponse.data?.token) {
    authToken = loginResponse.data.token;
    console.log('Login successful, auth token obtained');
    return true;
  } else {
    console.log('Login failed');
    return false;
  }
}

// Test creating a test product
async function createTestProduct() {
  console.log('=== Creating test product ===');
  
  const productData = {
    title: 'Test Product for Favorites',
    description: 'This is a test product for testing favorites functionality',
    price: 100,
    category: '64a1b2c3d4e5f6789012345', // You'll need to create a category first
    condition: 'new',
    phoneNumber: '1234567890',
    location: {
      city: 'Test City',
      area: 'Test Area',
      address: '123 Test Street'
    }
  };

  const response = await makeRequest('/products/add-product', 'POST', productData, authToken);
  
  if (response.data?.success && response.data?.product?._id) {
    console.log('Test product created successfully');
    return response.data.product._id;
  } else {
    console.log('Failed to create test product');
    return null;
  }
}

// Test favorites endpoints
async function testFavoritesEndpoints() {
  console.log('=== Testing Favorites Endpoints ===');

  if (!authToken) {
    console.log('No auth token available, skipping favorites tests');
    return;
  }

  // Create a test product
  const productId = await createTestProduct();
  if (!productId) {
    console.log('No product ID available, skipping favorites tests');
    return;
  }

  // Test 1: Add product to favorites
  console.log('Test 1: Add product to favorites');
  await makeRequest(`/favorites/add/${productId}`, 'POST', null, authToken);

  // Test 2: Check if product is in favorites
  console.log('Test 2: Check if product is in favorites');
  await makeRequest(`/favorites/check/${productId}`, 'GET', null, authToken);

  // Test 3: Get user's favorites
  console.log('Test 3: Get user\'s favorites');
  await makeRequest('/favorites', 'GET', null, authToken);

  // Test 4: Get favorites count
  console.log('Test 4: Get favorites count');
  await makeRequest('/favorites/count', 'GET', null, authToken);

  // Test 5: Get recent favorites
  console.log('Test 5: Get recent favorites');
  await makeRequest('/favorites/recent', 'GET', null, authToken);

  // Test 6: Check multiple products favorite status
  console.log('Test 6: Check multiple products favorite status');
  await makeRequest('/favorites/check-multiple', 'POST', { productIds: [productId] }, authToken);

  // Test 7: Toggle favorite status
  console.log('Test 7: Toggle favorite status');
  await makeRequest(`/favorites/toggle/${productId}`, 'PATCH', null, authToken);

  // Test 8: Check status after toggle
  console.log('Test 8: Check status after toggle');
  await makeRequest(`/favorites/check/${productId}`, 'GET', null, authToken);

  // Test 9: Toggle back to favorite
  console.log('Test 9: Toggle back to favorite');
  await makeRequest(`/favorites/toggle/${productId}`, 'PATCH', null, authToken);

  // Test 10: Remove from favorites
  console.log('Test 10: Remove from favorites');
  await makeRequest(`/favorites/remove/${productId}`, 'DELETE', null, authToken);

  // Test 11: Check status after removal
  console.log('Test 11: Check status after removal');
  await makeRequest(`/favorites/check/${productId}`, 'GET', null, authToken);

  // Test 12: Add back to favorites for cleanup
  console.log('Test 12: Add back to favorites for cleanup');
  await makeRequest(`/favorites/add/${productId}`, 'POST', null, authToken);

  // Test 13: Clear all favorites
  console.log('Test 13: Clear all favorites');
  await makeRequest('/favorites/clear', 'DELETE', null, authToken);

  // Test 14: Verify favorites are cleared
  console.log('Test 14: Verify favorites are cleared');
  await makeRequest('/favorites', 'GET', null, authToken);
}

// Test error cases
async function testErrorCases() {
  console.log('=== Testing Error Cases ===');

  // Test 1: Add non-existent product to favorites
  console.log('Test 1: Add non-existent product to favorites');
  await makeRequest('/favorites/add/64a1b2c3d4e5f6789012345', 'POST', null, authToken);

  // Test 2: Access without authentication
  console.log('Test 2: Access without authentication');
  await makeRequest('/favorites', 'GET', null, null);

  // Test 3: Invalid product ID format
  console.log('Test 3: Invalid product ID format');
  await makeRequest('/favorites/add/invalid-id', 'POST', null, authToken);

  // Test 4: Check multiple with invalid data
  console.log('Test 4: Check multiple with invalid data');
  await makeRequest('/favorites/check-multiple', 'POST', { productIds: 'invalid' }, authToken);
}

// Main test function
async function runTests() {
  console.log('Starting Favorites API Tests...\n');

  // Setup test user
  const userSetupSuccess = await setupTestUser();
  if (!userSetupSuccess) {
    console.log('Failed to setup test user, exiting...');
    return;
  }

  console.log('\n');

  // Test favorites endpoints
  await testFavoritesEndpoints();

  console.log('\n');

  // Test error cases
  await testErrorCases();

  console.log('\nFavorites API tests completed!');
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests, makeRequest, setupTestUser, testFavoritesEndpoints, testErrorCases };
