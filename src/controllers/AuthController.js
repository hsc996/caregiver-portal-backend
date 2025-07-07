const express = require("express");
const { UserModel } = require('../models/userModel');
const { 
    generateJWT,
    hashPassword,
    comparePassword
} = require('../functions/jwtFunctions');

const router = express.Router();


// Register new user - POST /api/auth/register

router.post("/signup", async (req, res) => {
    try {
            // Extract username, email and password from request body
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !password || !email){
        throw new Error("Missing required fields.");
    }

    // Check if username or email already exists
    const existingUser = await UserModel.findOne({
        $or: [{email: email}, {username: username}]
    });

    if (existingUser){
        const errorMessage =
            existingUser.email === email
            ? 'This email is already taken.'
            : 'Username already taken.';
        throw new Error(errorMessage)
    }

    // Hash the password
    const hashedPw = await hashPassword(password);

    // Create new user
    let newUser = await UserModel.create({
        username: username,
        email: email,
        password: hashedPw
    });

    console.log(`New user created successfully: ${newUser.username} (${newUser.email})`);

    // Generate JWT
    const token = generateJWT(newUser._id, newUser.username);

    const safeUser = newUser.toObject();
    delete safeUser.password;

    // Return user data
    res.status(201).json({
        message: "User created successfully",
        user: safeUser,
        token: token
    });

    } catch (error) {
        console.error(`An error occurred while creating user: ${error.message}`);
        throw new Error("Unable to register new user.")
    }    
});


// Sign in existing user

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    // Search for user by email

    // Check if password is valid (compare passwords)

    // Create new JWT


})

module.exports = router;