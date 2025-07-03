const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));

const PORT = process.env.PORT || 3000;

app.get("/ping", (req, res) => {
  res.send("Pong!");
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// This is a test comment for CI/CD
console.log('App is starting...');

const express = require('express');
const app = express();
// ... rest of your server.js code