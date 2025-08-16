const { UserModel } = require('../models/userModel');
const { AppError } = require('../functions/helperFunctions');
const { default: mongoose } = require('mongoose');

// Find user by query

async function FindUserByQuery(query, projection = { password: 0}){
    const result = await UserModel.findOne(query, projection);

    if (!result){
        throw new AppError("User not found.", 404);
    }

    return result;
}



// Find all users -- incl pagination

async function FindAllUsers(query = {}, { page = 1, limit = 10 } = {}){
    const skip = (page - 1) * limit;
    const users = await UserModel.find().skip(skip).limit(limit);
    const total = await UserModel.countDocuments();

    return {
        total,
        page,
        limit,
        users
    }
}


// Update user by query
async function UpdateUserByQuery(query, updatedData){
    if (!query._id && !mongoose.Types.ObjectId.isValid(query._id)){
        throw new AppError("Invalid user ID format.");
    }
    const sanitizedData = { ...updatedData };
    delete sanitizedData._id;
    delete sanitizedData.password;

    const result = await UserModel.findOneAndUpdate(query, sanitizedData, {
        new: true,
        runValidators: true,
        projection: { password: 0 }
    });

    console.log(result);
    return result;
}



// Soft delete user by query

async function DeleteUserByQuery(query){
    const result = await UserModel.findOne(query);

    if (!result){
        throw new AppError("No user found to delete.", 404);
    }

    if (!result.isActive){
        throw new AppError("This user has already been deactivated.")
    }

    // Soft delete user
    result.isActive = false;
    result.deletedAt = new Date();
    await result.save();

    // Remove sensitive data before returning
    const safeUser = result.toObject();
    delete safeUser.password;
    return safeUser;
}



module.exports = {
    FindUserByQuery,
    FindAllUsers,
    UpdateUserByQuery,
    DeleteUserByQuery
}