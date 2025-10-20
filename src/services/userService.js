const { UserModel } = require('../models/userModel');
const { AppError } = require('../functions/helperFunctions');
const { mongoose } = require('mongoose');

// Find user by query

async function FindUserByQuery(query, projection = { password: 0}){
    const result = await UserModel.findOne(query, projection).lean();

    if (!result){
        throw new AppError("User not found.", 404);
    }

    return result;
}

// Find all users -- incl pagination

async function FindAllUsers(query = {}, { page = 1, limit = 10 } = {}){
    const skip = (page - 1) * limit;

    const users = await UserModel
    .find(query, {password: 0})
    .skip(skip).limit(limit)
    .lean();

    const total = await UserModel.countDocuments(query);

    return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        users
    }
}


// Update user by query
async function UpdateUserByQuery(query, updatedData){
    if (query._id && !mongoose.Types.ObjectId.isValid(query._id)){
        throw new AppError("Invalid user ID format.", 400);
    }

    // Prevent updating protected fields
    const sanitizedData = { ...updatedData };
    delete sanitizedData._id;
    delete sanitizedData.password;
    delete sanitizedData.role;
    delete sanitizedData.createdAt;
    delete sanitizedData.updatedAt;

    const result = await UserModel.findOneAndUpdate(query, sanitizedData, {
        new: true,
        runValidators: true,
        projection: { password: 0 }
    }).lean();

    if (!result){
        throw new AppError("User not found.", 404);
    }

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

    return result.toSafeObject();
}



module.exports = {
    FindUserByQuery,
    FindAllUsers,
    UpdateUserByQuery,
    DeleteUserByQuery
}