// server.js (or app.js)

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const authMiddleware = require('./middleware/authMiddleware');
const SignupModel = require('./Schema/Signup');
const FoodDetail = require('./Schema/Food');
const WeeklyDishes = require('./Schema/Weeklydishes');
const SubscriptionModel = require('./Schema/Subscribe');
const emailRoutes = require('./routes/emailRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://munishgoel45698:9r3jwSuO1CzegsfD@cluster0.9r9br1c.mongodb.net/FoodWeb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected to db"))
  .catch(err => console.log("Error connecting to db: ", err));
// Routes
app.use('/email', emailRoutes);

// User registration
app.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    // Check if user already exists
    const existingUser = await SignupModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new SignupModel({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await SignupModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Add product (FoodDetail)
app.post('/addproduct', async (req, res) => {
  try {
    const product = await FoodDetail.create(req.body);
    res.json({ product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Adding product failed' });
  }
});

// Add weekly dish (WeeklyDishes)
app.post('/addweeklydish', async (req, res) => {
  try {
    const product = await WeeklyDishes.create(req.body);
    res.json({ product });
  } catch (error) {
    console.error('Error adding weekly dish:', error);
    res.status(500).json({ error: 'Adding weekly dish failed' });
  }
});

// Subscribe to service
// app.post('/subscribe', async (req, res) => {
//   try {
//     const subscription = await SubscriptionModel.create(req.body);
//     res.json({ subscription });
//   } catch (error) {
//     console.error('Error subscribing:', error);
//     res.status(500).json({ error: 'Subscription failed' });
//   }
// });
app.post('/subscribe', async (req, res) => {
  try {
    const { userId, type, startDate, endDate } = req.body;

    // Validate the incoming request data
    if (!userId || !type || !startDate || !endDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create and save the new subscription
    const newSubscription = new SubscriptionModel({
      userId,
      type,
      startDate,
      endDate,
    });

    await newSubscription.save();

    // Respond with success message
    res.status(201).json({ message: 'Subscription created successfully', subscription: newSubscription });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all products (FoodDetail)
app.get('/products', async (req, res) => {
  try {
    const products = await FoodDetail.find({});
    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Fetching products failed' });
  }
});

// Get all weekly dishes (WeeklyDishes)
app.get('/weeklydishes', async (req, res) => {
  try {
    const dishes = await WeeklyDishes.find({});
    res.json({ dishes });
  } catch (error) {
    console.error('Error fetching weekly dishes:', error);
    res.status(500).json({ error: 'Fetching weekly dishes failed' });
  }
});

// Get user subscriptions
app.get('/subscription', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptions = await SubscriptionModel.find({ userId });
    res.json({ subscriptions });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Fetching subscriptions failed' });
  }
});

// Update user profile
app.put('/updateuser/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await SignupModel.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Updating user profile failed' });
  }
});

// Delete user account
app.delete('/deleteuser/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await SignupModel.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ error: 'Deleting user account failed' });
  }
});

// Update product (FoodDetail) by ID
app.put('/updateproduct/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await FoodDetail.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Updating product failed' });
  }
});

// Delete product (FoodDetail) by ID
app.delete('/deleteproduct/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await FoodDetail.findByIdAndDelete(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Deleting product failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
