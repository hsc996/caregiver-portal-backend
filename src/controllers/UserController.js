const express = require("express");
const { UserModel } = require('../models/userModel');
const {
    FindUserByQuery,
    FindAllUsers,
    UpdateUserByQuery,
    DeleteUserByQuery
} = require('../services/userService');

const router = express.Router();

// Get all users - GET
router.get("/profile", async () => {
    
})







// Update profile data





// Delete profile





