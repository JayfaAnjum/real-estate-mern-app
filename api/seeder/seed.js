import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Listing from '../models/Listing.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Sample Users
const users = [
  { username: 'john_doe', email: 'john@gmail.com', password: '123456' },
  { username: 'sarah_smith', email: 'sarah@gmail.com', password: '123456' },
  { username: 'mike_ross', email: 'mike@gmail.com', password: '123456' },
  { username: 'emma_watson', email: 'emma@gmail.com', password: '123456' },
  { username: 'alex_brown', email: 'alex@gmail.com', password: '123456' },
];

// Generate random listings for each user
const generateListing = (user, index) => {
  const types = ['rent', 'sale'];
  const offers = [true, false];
  const furnished = [true, false];
  const parking = [true, false];

  return {
    name: `${types[index % 2] === 'rent' ? 'Rental' : 'Sale'} Property #${index + 1} for ${user.username}`,
    description: `Beautiful ${types[index % 2]} property located in prime area. Perfect for families or professionals.`,
    address: `Address ${Math.floor(Math.random() * 100)}, Colombo, Sri Lanka`,
    regularPrice: Math.floor(Math.random() * 500000) + 500, // 500 to 500500
    discountPrice: Math.floor(Math.random() * 500000) + 400, // slightly different
    bathrooms: Math.floor(Math.random() * 4) + 1, // 1-4
    bedrooms: Math.floor(Math.random() * 5) + 1, // 1-5
    furnished: furnished[Math.floor(Math.random() * furnished.length)],
    parking: parking[Math.floor(Math.random() * parking.length)],
    type: types[Math.floor(Math.random() * types.length)],
    offer: offers[Math.floor(Math.random() * offers.length)],
    imageUrls: [
      `https://picsum.photos/seed/${user.username + index}/400/300`
    ],
    userRef: user._id.toString()
  };
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Listing.deleteMany();

    // Insert Users
    const createdUsers = await User.insertMany(users);
    console.log(`Inserted ${createdUsers.length} users`);

    // Insert 5 unique listings for each user
    let totalListings = 0;
    for (const user of createdUsers) {
      for (let i = 0; i < 5; i++) {
        const listing = new Listing(generateListing(user, i));
        await listing.save();
        totalListings++;
      }
    }

    console.log(`Inserted ${totalListings} unique listings`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
