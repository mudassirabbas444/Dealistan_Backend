import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../src/mvc/models/user.js';
import Product from '../src/mvc/models/product.js';
import Category from '../src/mvc/models/category.js';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://theunionsoft_db_user:Mudassir%40444@cluster0.gldsxsw.mongodb.net/Dealistaan?retryWrites=true&w=majority&appName=Cluster0");
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample categories
const sampleCategories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and gadgets',
    icon: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    name: 'Vehicles',
    slug: 'vehicles',
    description: 'Cars, bikes, and other vehicles',
    icon: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing, shoes, and accessories',
    icon: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Furniture, home decor, and garden items',
    icon: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    description: 'Sports equipment and fitness gear',
    icon: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    name: 'Books & Media',
    slug: 'books-media',
    description: 'Books, movies, music, and games',
    icon: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    isActive: true
  }
];

// Sample users
const sampleUsers = [
  {
    _id: '68e1b80f9c25671db7cd3fbd',
    name: 'Mudassir',
    email: 'super-admin@adultedpro.com',
    phone: '923136012879',
    password: 'admin123', // Will be hashed
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    city: 'Karachi',
    role: 'admin',
    verified: true
  },
  {
    name: 'Sarah Ahmed',
    email: 'sarah.ahmed@example.com',
    phone: '923001234567',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
    city: 'Lahore',
    role: 'user',
    verified: true
  },
  {
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@example.com',
    phone: '923002345678',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    city: 'Islamabad',
    role: 'user',
    verified: true
  },
  {
    name: 'Fatima Khan',
    email: 'fatima.khan@example.com',
    phone: '923003456789',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    city: 'Karachi',
    role: 'user',
    verified: true
  },
  {
    name: 'Mohammad Ali',
    email: 'mohammad.ali@example.com',
    phone: '923004567890',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
    city: 'Peshawar',
    role: 'user',
    verified: true
  }
];

// Sample products
const sampleProducts = [
  {
    title: 'iPhone 14 Pro Max',
    description: 'Latest iPhone with A16 Bionic chip, 48MP camera, and ProMotion display. Excellent condition, barely used.',
    price: 150000,
    category: 'Electronics',
    condition: 'used',
    images: [
      { url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop', public_id: 'sample_phone_1' },
      { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop', public_id: 'sample_phone_2' }
    ],
    location: {
      city: 'Karachi',
      area: 'DHA Phase 2'
    },
    seller: '68e1b80f9c25671db7cd3fbd',
    status: 'approved'
  },
  {
    title: 'Honda Civic 2020',
    description: 'Well-maintained Honda Civic with low mileage. Regular service records available. Perfect for daily commute.',
    price: 4500000,
    category: 'Vehicles',
    condition: 'used',
    images: [
      { url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop', public_id: 'sample_car_1' },
      { url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop', public_id: 'sample_car_2' }
    ],
    location: {
      city: 'Lahore',
      area: 'Gulberg'
    },
    seller: '68e1b80f9c25671db7cd3fbd',
    status: 'approved'
  },
  {
    title: 'Designer Leather Jacket',
    description: 'Premium quality leather jacket from a well-known brand. Size Medium, perfect fit. Only worn a few times.',
    price: 25000,
    category: 'Fashion',
    condition: 'used',
    images: [
      { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=400&fit=crop', public_id: 'sample_jacket_1' },
      { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop', public_id: 'sample_jacket_2' }
    ],
    location: {
      city: 'Islamabad',
      area: 'F-8'
    },
    seller: '68e1b80f9c25671db7cd3fbd',
    status: 'approved'
  },
  {
    title: 'MacBook Pro M2',
    description: 'Latest MacBook Pro with M2 chip, 16GB RAM, 512GB SSD. Perfect for professionals and students.',
    price: 200000,
    category: 'Electronics',
    condition: 'new',
    images: [
      { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop', public_id: 'sample_laptop_1' },
      { url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=400&fit=crop', public_id: 'sample_laptop_2' }
    ],
    location: {
      city: 'Karachi',
      area: 'Clifton'
    },
    seller: '68e1b80f9c25671db7cd3fbd',
    status: 'approved'
  },
  {
    title: 'Nike Air Max 270',
    description: 'Comfortable running shoes in excellent condition. Size 9, perfect for daily wear and workouts.',
    price: 12000,
    category: 'Fashion',
    condition: 'used',
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop', public_id: 'sample_shoes_1' },
      { url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=400&fit=crop', public_id: 'sample_shoes_2' }
    ],
    location: {
      city: 'Peshawar',
      area: 'Hayatabad'
    },
    seller: '68e1b80f9c25671db7cd3fbd',
    status: 'approved'
  },
  {
    title: 'Samsung Galaxy S23 Ultra',
    description: 'Flagship Samsung phone with S Pen, 200MP camera, and 5G connectivity. Box and accessories included.',
    price: 180000,
    category: 'Electronics',
    condition: 'new',
    images: [
      { url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=400&fit=crop', public_id: 'sample_samsung_1' },
      { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop', public_id: 'sample_samsung_2' }
    ],
    location: {
      city: 'Lahore',
      area: 'Model Town'
    },
    seller: '68e1b80f9c25671db7cd3fbd',
    status: 'approved'
  },
  {
    title: 'Yamaha YBR 125',
    description: 'Reliable motorcycle perfect for city commuting. Good mileage, well-maintained engine. Registration papers available.',
    price: 180000,
    category: 'Vehicles',
    condition: 'used',
    images: [
      { url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop', public_id: 'sample_bike_1' },
      { url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&h=400&fit=crop', public_id: 'sample_bike_2' }
    ],
    location: {
      city: 'Karachi',
      area: 'North Nazimabad'
    },
    seller: '68e1b80f9c25671db7cd3fbd',
    status: 'approved'
  },
  {
    title: 'Modern Dining Table Set',
    description: 'Beautiful 6-seater dining table with chairs. Made from premium wood, perfect for modern homes.',
    price: 85000,
    category: 'Home & Garden',
    condition: 'used',
    images: [
      { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop', public_id: 'sample_table_1' },
      { url: 'https://images.unsplash.com/photo-1551298370-9df3b8792fb7?w=600&h=400&fit=crop', public_id: 'sample_table_2' }
    ],
    location: {
      city: 'Islamabad',
      area: 'DHA Phase 1'
    },
    seller: '68e1b80f9c25671db7cd3fbd',
    status: 'approved'
  },
  {
    title: 'Treadmill for Home Gym',
    description: 'Electric treadmill with incline feature, heart rate monitor, and multiple workout programs. Great for home fitness.',
    price: 95000,
    category: 'Sports & Fitness',
    condition: 'used',
    images: [
      { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop', public_id: 'sample_treadmill_1' },
      { url: 'https://images.unsplash.com/photo-1538805060514-97d9cc30e843?w=600&h=400&fit=crop', public_id: 'sample_treadmill_2' }
    ],
    location: {
      city: 'Karachi',
      area: 'Defence'
    },
    seller: '68e1b80f9c25671db7cd3fbd',
    status: 'approved'
  },
  {
    title: 'Programming Books Collection',
    description: 'Complete set of programming books including JavaScript, Python, React, and Node.js. Perfect for developers.',
    price: 15000,
    category: 'Books & Media',
    condition: 'used',
    images: [
      { url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop', public_id: 'sample_books_1' },
      { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop', public_id: 'sample_books_2' }
    ],
    location: {
      city: 'Lahore',
      area: 'Johar Town'
    },
    seller: '68e1b80f9c25671db7cd3fbd',
    status: 'approved'
  }
];

// Hash password function
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Insert categories
const insertCategories = async () => {
  try {
    await Category.deleteMany({});
    console.log('Cleared existing categories');
    
    const categories = await Category.insertMany(sampleCategories);
    console.log(`Inserted ${categories.length} categories`);
    return categories;
  } catch (error) {
    console.error('Error inserting categories:', error);
    throw error;
  }
};

// Insert users
const insertUsers = async () => {
  try {
    await User.deleteMany({});
    console.log('Cleared existing users');
    
    // Hash passwords
    const usersWithHashedPasswords = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await hashPassword(user.password)
      }))
    );
    
    const users = await User.insertMany(usersWithHashedPasswords);
    console.log(`Inserted ${users.length} users`);
    return users;
  } catch (error) {
    console.error('Error inserting users:', error);
    throw error;
  }
};

// Insert products
const insertProducts = async (categories, users) => {
  try {
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Map category names to IDs
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });
    
    // Update products with category IDs and seller IDs
    const productsWithIds = sampleProducts.map(product => ({
      ...product,
      category: categoryMap[product.category],
      seller: users[0]._id, // Use the first user (admin) as seller
      phoneNumber: users[0].phone, // Use admin's phone number
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    const products = await Product.insertMany(productsWithIds);
    console.log(`Inserted ${products.length} products`);
    return products;
  } catch (error) {
    console.error('Error inserting products:', error);
    throw error;
  }
};

// Main function to insert all sample data
const insertSampleData = async () => {
  try {
    console.log('Starting sample data insertion...');
    
    // Connect to database
    await connectDB();
    
    // Insert data
    const categories = await insertCategories();
    const users = await insertUsers();
    const products = await insertProducts(categories, users);
    
    console.log('\n✅ Sample data insertion completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log('\n🔑 Admin User Credentials:');
    console.log('   Email: super-admin@adultedpro.com');
    console.log('   Password: admin123');
    console.log('   Phone: 923136012879');
    
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n📝 Database connection closed');
    process.exit(0);
  }
};

// Run the script
insertSampleData();
