const {
  registerUserService,
  loginUserService,
  requestPasswordResetService,
  resetPasswordService
 } = require('../services/authService');
const { AppError } = require('../functions/helperFunctions');


/** 
 * Controller to handle user account registration
 * @param {Request} req
 * @param {Response} res 
 * @param {Function} next
*/
async function signup(req, res, next){
  try {
    const { username, email, password } = req.body;
    const { user, token } = await registerUserService({ username, email, password});

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      user,
      token
    });
  } catch (error) {
    next(error);
  }
}


/** 
 * Controller to handle user sign in
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next 
*/
async function signin(req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUserService({ email, password });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      user,
      token
    });
  } catch (error) {
    next(error);
  }
}


/** 
 * Controller to request password reset email
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next 
*/
async function requestPasswordReset(req, res, next) {
  try {
    const { email } = req.body;
    const result = await requestPasswordResetService({email});

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
}


/** 
 * Controller to reset password with token
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next 
*/
async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    const result = await resetPasswordService({ token, newPassword });

    res.status(200).json({
      success: true,
      message: result.message
    })
  } catch (error) {
    next(error);
  }
}


module.exports = {
    signin,
    signup,
    resetPassword,
    requestPasswordReset
}