import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from './controllers/passport.js'; // Import Passport configuration
import contactRoutes from './routes/contact.js'; // Import Contact routes

dotenv.config(); // Load environment variables from .env file

// Import other routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import categoryRoutes from './routes/category.js';
import productRoutes from './routes/product.js';
import braintreeRoutes from './routes/braintree.js';
import orderRoutes from './routes/order.js';
import reviewRoutes from './routes/review.js';
import oauthRoutes from './routes/oauthRoutes.js'; // Import OAuth routes

// Initialize the Express application
const app = express();

// Connect to the database
mongoose
    .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB Connected'))
    .catch(err => console.error('DB Connection Error:', err));

// Middleware setup
app.use(morgan('dev')); // Logging middleware
app.use(express.json()); // Built-in body parser middleware to handle JSON requests
app.use(cookieParser()); // Cookie parser middleware

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3001', 'http://192.168.178.91:3001'], // Allow requests from your frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // Enable sending cookies
}));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', braintreeRoutes);
app.use('/api', orderRoutes);
app.use('/api', reviewRoutes);
app.use('/api', oauthRoutes); // Add OAuth routes
app.use('/api', contactRoutes); // Add Contact routes

// Define the port
const port = process.env.PORT || 8000;

// Add detailed logging for every request
app.use((req, res, next) => {
  console.log(`--- New Request ---`);
  console.log(`Request URL: ${req.url}`);
  console.log(`Request Method: ${req.method}`);
  console.log(`Request Headers: ${JSON.stringify(req.headers)}`);
  console.log(`Request Body: ${JSON.stringify(req.body)}`);
  console.log(`Request Session: ${JSON.stringify(req.session)}`);
  console.log(`Request User: ${JSON.stringify(req.user)}`);
  next();
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
