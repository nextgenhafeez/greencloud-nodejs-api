// config/db.js

const mongoose = require("mongoose");

// Construct the MongoDB connection string using environment variables.
// These environment variables will be provided by Cloud Run (from Secret Manager for password).
const mongoConnectionString = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority&appName=${process.env.MONGO_APP_NAME}`;

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log(`Host: ${process.env.MONGO_HOST}`);
    console.log(`Database: ${process.env.MONGO_DB_NAME}`);
    console.log(`Username: ${process.env.MONGO_USERNAME}`);
    console.log(`App Name: ${process.env.MONGO_APP_NAME}`); // Added for debugging

    await mongoose.connect(mongoConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true, // Deprecated and can be removed in newer Mongoose versions
      // useFindAndModify: false // Deprecated and can be removed in newer Mongoose versions
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    // Log the full connection string (without password for security) for debugging
    console.error(`Connection String attempted (without password): mongodb+srv://${process.env.MONGO_USERNAME}:<hidden_password>@${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority&appName=${process.env.MONGO_APP_NAME}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
