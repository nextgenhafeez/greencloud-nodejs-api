const express = require("express");
const router = express.Router();
const gravatar = require("gravatar"); // For generating user avatars
const bcrypt = require("bcryptjs"); // For hashing passwords
const jwt = require("jsonwebtoken"); // For creating JSON Web Tokens
const { check, validationResult } = require("express-validator"); // For input validation

const User = require("../../models/User"); // Mongoose User model

// @route    POST api/users
// @desc     Register user
// @access   Public
// This route allows new users to register by providing a name, email, and password.
router.post(
  "/",
  [
    // Input validation checks using express-validator
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user already exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // Get user's gravatar based on email
      const avatar = gravatar.url(email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" // Default image if no gravatar exists
      });

      // Create new user instance
      user = new User({
        name,
        email,
        avatar,
        password
      });

      // Hash password
      const salt = await bcrypt.genSalt(10); // Generate salt for hashing
      user.password = await bcrypt.hash(password, salt); // Hash the password

      // Save user to database
      await user.save();

      // Create JWT payload (contains user ID)
      const payload = {
        user: {
          id: user.id
        }
      };

      // Sign the JWT
      // process.env.JWT_SECRET must be set as an environment variable in Cloud Run
      jwt.sign(
        payload,
        process.env.JWT_SECRET, // Secret key for signing the token
        { expiresIn: 360000 }, // Token expiration time (e.g., 100 hours)
        (err, token) => {
          if (err) throw err;
          res.json({ token }); // Send the token back to the client
        }
      );
    } catch (err) {
      // Catch any server errors
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
