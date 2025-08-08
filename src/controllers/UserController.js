const { UserModel } = require('../models/userModel');
const {
    FindUserByQuery,
    FindAllUsers,
    UpdateUserByQuery,
    DeleteUserByQuery
} = require('../services/userService');
const { AppError } = require('../functions/helperFunctions');

/** 
 * Controller to handle fetching all users
 * @param {Request} req
 * @param {Response} res 
*/
async function getAllUsers(req, res, next){
    try {
        const { page, limit } = req.pagination;

        const filter = {};
        const users = await FindAllUsers(
            filter,
            { page, limit }
        );

        res.status(200).json(users)
    } catch (error) {
        console.error('Error fetching all users via controller method:', error);
        next(error);
    }
}


/**
 * Controller to update a user by query
 * @route PUT /users/{id}
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
async function updateUserData(req, res, next){
    try {
        const { id }  = req.params;
        const updatedData = req.body;

        const updatedUser = await UpdateUserByQuery(
            {_id: id},
            updatedData
        );

        if (!updatedUser){
            throw new AppError("User not found.", 404);
        }

        res.status(200).json({
            success: true,
            message: "User data successfully updated.",
            data: updatedUser
        });
    } catch (error) {
        next(error);
    }
}


// Delete profile





module.exports = {
    getAllUsers,
    updateUserData
}