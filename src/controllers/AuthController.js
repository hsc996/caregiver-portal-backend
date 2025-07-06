const express = require("express");
const { UserModel } = require('../models/userModel');
const { 
    generateJWT,
    hashPassword,
    comparePassword
} = require('../functions/jwtFunctions');

const router = express.Router();


// Register new user - POST /api/auth/register




// Sign in existing user