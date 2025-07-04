// server.js

const express = require('express');
const app = express();
const connectDB = require('./config/db'); // Import the connectDB function
// const config = require('config'); // You might not even need this if all config is via process.env for prod

// Middleware
app.use(express.json()); // Example: Body parser for JSON requests

// Connect to MongoDB
connectDB(); // Call the function to connect to the database

// Define your routes here
app.get('/test', (req, res) => {
  res.send('Hello from the API!');
});

// ... (any other routes you have) ...

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
// In server.js
app.get('/test', (req, res) => {
  res.send('Hello from the API! (Updated)'); // Changed message
});
// In server.js
app.get('/test', (req, res) => {
  res.send('Hello from the API! (CI/CD confirmed)'); // Changed message again
});
//"Test: Final CI/CD confirmation after trigger recreation"