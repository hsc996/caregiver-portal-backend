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
async function getAllUsersController(req, res, next){
    try {
        const { page, limit } = req.pagination;

        const filter = { isActive: true };
        const users = await FindAllUsers(
            filter,
            { page, limit }
        );

        res.status(200).json({
            success: true,
            data: users.users,
            pagination: {
                total: users.total,
                page: users.page,
                limit: users.limit,
                totalPages: users.totalPages
            }
        })
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
 * @param {Function} next - Express next function
 * @returns {Promise<void>}
 */
async function updateUserDataController(req, res, next){
    try {
        const { id }  = req.params;
        const updatedData = req.body;

        const updatedUser = await UpdateUserByQuery(
            {_id: id},
            updatedData
        );

        res.status(200).json({
            success: true,
            data: updatedUser,
            message: "User data updated successfully."
        })
    } catch (error) {
        next(error);
    }
}


// Delete profile
async function softDeleteUser(req, res, next){
    try {
        const { id } = req.params;

        const deleteUser = await DeleteUserByQuery({ _id: id });

        res.status(200).json({
            success: true,
            data: deleteUser,
            message: "User deleted successfully."
        })
    } catch (error) {
        next(error);
    }
}


module.exports = {
    getAllUsersController,
    updateUserDataController,
    softDeleteUser
}