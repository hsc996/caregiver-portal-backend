const {
  registerUserService,
  loginUserService,
  requestPasswordResetService,
  resetPasswordService,
  refreshTokenService
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
    const { user, token, refreshToken } = await registerUserService({ username, email, password});

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      user,
      token,
      refreshToken
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
    const { user, token, refreshToken } = await loginUserService({ email, password });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      user,
      token,
      refreshToken
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

/** 
 * Controller to refresh access token
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next 
*/
async function refreshToken(req, res, next){
  try {
    const { refreshToken } = req.body;
    const result = await refreshTokenService({refreshToken});

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully.",
      token: result.token,
      refreshToken: result.refreshToken
    });
  } catch (error) {
    next(error);
  }
}


module.exports = {
    signin,
    signup,
    resetPassword,
    requestPasswordReset,
    refreshToken
}