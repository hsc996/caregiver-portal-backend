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
    if (!user || !password || !email){
        throw new Error("Missing required fields.");
    }

    // Check if username or email already exists
    const existingUser = UserModel.findOne({
        $or: [{email: email}, {usernaem: username}]
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
        password: password
    });

    console.log(`New user created successfully: ${newUser.username} (${newUser.email})`);

    // Generate JWT
    const generateJWt = generateJWT(newUser._id, newUser.username);

    // Remove sensitive information before returning user data
    const safeUser = newUser.toObject();
    delete newUser.password;
    return safeUser;
    } catch (error) {
        console.error(`An error occurred while creating user: ${error}`);
        throw new Error("Unable to reguster new user")
    }    
});


// Sign in existing user