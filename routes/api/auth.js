const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // For comparing passwords
const auth = require("../../middleware/auth"); // Custom authentication middleware
const jwt = require("jsonwebtoken"); // For creating JSON Web Tokens
const { check, validationResult } = require("express-validator"); // For input validation

const User = require("../../models/User"); // Mongoose User model

// @route    GET api/auth
// @desc     Get authenticated user data
// @access   Private
// This route is protected by the 'auth' middleware, meaning only valid token holders can access it.
router.get("/", auth, async (req, res) => {
  try {
    // req.user.id is set by the 'auth' middleware after token verification
    const user = await User.findById(req.user.id).select("-password"); // Fetch user, exclude password
    res.json(user); // Send user data
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token (Login)
// @access   Public
// This route allows existing users to log in and receive a JWT.
router.post(
  "/",
  [
    // Input validation checks
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] }); // Use generic message for security
      }

      // Compare provided password with hashed password in DB
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] }); // Use generic message for security
      }

      // Create JWT payload
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
        { expiresIn: 360000 }, // Token expiration time
        (err, token) => {
          if (err) throw err;
          res.json({ token }); // Send the token back to the client
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
