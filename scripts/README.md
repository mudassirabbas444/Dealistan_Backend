# Sample Data Script

This script inserts sample data into the Dealistaan database for testing and development purposes.

## What it includes:

### Users (5 users)
- **Admin User**: Mudassir (super-admin@adultedpro.com)
- **Regular Users**: Sarah Ahmed, Ahmed Hassan, Fatima Khan, Mohammad Ali
- All users have real profile images from Unsplash
- Passwords are hashed using bcrypt

### Categories (6 categories)
- Electronics
- Vehicles  
- Fashion
- Home & Garden
- Sports & Fitness
- Books & Media
- Each category has a real image from Unsplash

### Products (10 products)
- iPhone 14 Pro Max
- Honda Civic 2020
- Designer Leather Jacket
- MacBook Pro M2
- Nike Air Max 270
- Samsung Galaxy S23 Ultra
- Yamaha YBR 125
- Modern Dining Table Set
- Treadmill for Home Gym
- Programming Books Collection

All products use real images from Unsplash and are listed by the admin user.

## How to run:

```bash
# From the server directory
npm run seed
```

## Admin Credentials:
- **Email**: super-admin@adultedpro.com
- **Password**: admin123
- **Phone**: 923136012879
- **Role**: admin

## Notes:
- The script will clear existing data before inserting new data
- All images are sourced from Unsplash (free stock photos)
- Products are automatically assigned to the admin user as the seller
- All data follows the application's schema requirements
