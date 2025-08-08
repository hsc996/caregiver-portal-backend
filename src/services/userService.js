const { UserModel } = require('../models/userModel');
const { AppError } = require('../functions/helperFunctions');

// Find user by query

async function FindUserByQuery(query, projection = { password: 0}){
    try {
        const result = await UserModel.findOne(query, projection);

        if (!result){
            throw new AppError("User not found.", 404);
        }

        return result;
    } catch (error) {
        console.error(`Error finding user with query: ${JSON.stringify(query)}`, error);

        throw new AppError("Error finding user.", 500);
    }
}



// Find all users -- incl pagination

async function FindAllUsers(query = {}, { page = 1, limit = 10 } = {}){
    try {
        const skip = (page - 1) * limit;
        const users = await UserModel.find().skip(skip).limit(limit);
        const total = await UserModel.countDocuments();

        return {
            total,
            page,
            limit,
            users
        }
    } catch (error) {
        console.error("Error fetching all users: ", error);
        throw new AppError("Failed to fecth all users.", 500);
    }
}


// Update user by query
async function UpdateUserByQuery(query, updatedData){
    try {
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
        
    } catch (error) {
        console.error(`Error updating user with query: ${JSON.stringify(query)}`);
        throw new AppError("Failed to update user data.", 500);
    }
}



// Soft delete user by query

async function DeleteUserByQuery(query){
    try {
        const result = await UserModel.find(query);

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

    } catch (error) {
        console.error(`Error deleting user with query: ${JSON.stringify(query)}`);
        throw new AppError("Failed to delete user.", 500);
    }
}



module.exports = {
    FindUserByQuery,
    FindAllUsers,
    UpdateUserByQuery,
    DeleteUserByQuery
}