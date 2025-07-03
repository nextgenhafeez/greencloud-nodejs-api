const mongoose = require("mongoose");

const mongoConnectionString = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true, // Often deprecated in newer Mongoose, good to remove if present
      // useFindAndModify: false // Often deprecated in newer Mongoose, good to remove if present
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
