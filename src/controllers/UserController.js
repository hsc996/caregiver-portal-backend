const {
    FindUserByQuery,
    FindAllUsers,
    UpdateUserByQuery,
    DeleteUserByQuery,
    createUserService,
    sendInviteService,
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

        const filter = { isActive: true, companyId: req.user.companyId };
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
        const { id } = req.params;
        const allowed = ['firstName', 'lastName', 'email'];
        const updatedData = {};
        allowed.forEach(field => {
            if (req.body[field] !== undefined) updatedData[field] = req.body[field];
        });

        const updatedUser = await UpdateUserByQuery(
            { _id: id, companyId: req.user.companyId },
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

        const deleteUser = await DeleteUserByQuery({ _id: id, companyId: req.user.companyId });

        res.status(200).json({
            success: true,
            data: deleteUser,
            message: "User deleted successfully."
        })
    } catch (error) {
        next(error);
    }
}


async function uploadProfileImageController(req, res, next) {
    try {
        if (!req.file) {
            throw new AppError("No image file provided.", 400);
        }

        const { id } = req.params;
        const updatedUser = await UpdateUserByQuery(
            { _id: id },
            { profileImg: req.file.path }
        );

        res.status(200).json({
            success: true,
            data: updatedUser,
            message: "Profile image updated successfully."
        });
    } catch (error) {
        next(error);
    }
}


async function createUserController(req, res, next) {
    try {
        const { firstName, lastName, email, role } = req.body;
        const user = await createUserService({
            firstName, lastName, email, role,
            companyId: req.user.companyId,
        });

        res.status(201).json({
            success: true,
            data: user,
            message: "User created. A welcome email with a password setup link has been sent."
        });
    } catch (error) {
        next(error);
    }
}


async function sendInviteController(req, res, next) {
    try {
        const { email, role } = req.body;
        await sendInviteService({ email, role, companyId: req.user.companyId });
        res.status(200).json({
            success: true,
            message: "Invite sent successfully.",
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllUsersController,
    updateUserDataController,
    softDeleteUser,
    uploadProfileImageController,
    createUserController,
    sendInviteController,
}