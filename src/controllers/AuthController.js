const { registerUserService, loginUserService } = require('../services/authService');
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
      message: "User successfully signed in.",
      user,
      token
    });
  } catch (error) {
    next(error);
  }
}


module.exports = {
    signin,
    signup
}