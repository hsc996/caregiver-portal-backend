const {
  signupService,
  joinService,
  loginUserService,
  requestPasswordResetService,
  resetPasswordService,
  refreshTokenService,
  logoutService
 } = require('../services/authService');


async function signup(req, res, next){
  try {
    const { firstName, lastName, username, email, password, companyName } = req.body;
    const { user, token, refreshToken } = await signupService({ firstName, lastName, username, email, password, companyName });

    res.status(201).json({
      success: true,
      message: "Company and admin account created successfully.",
      user,
      token,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
}


async function join(req, res, next){
  try {
    const { firstName, lastName, username, email, password, inviteCode } = req.body;
    const { user, token, refreshToken } = await joinService({ firstName, lastName, username, email, password, inviteCode });

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user,
      token,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
}


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


async function requestPasswordReset(req, res, next) {
  try {
    const { email } = req.body;
    const result = await requestPasswordResetService({ email });

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
}


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


async function refreshToken(req, res, next){
  try {
    const { refreshToken } = req.body;
    const result = await refreshTokenService({ refreshToken });

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


async function logout(req, res, next) {
  try {
    await logoutService(req.user.id);
    res.status(200).json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    next(error);
  }
}

module.exports = {
    signin,
    signup,
    join,
    resetPassword,
    requestPasswordReset,
    refreshToken,
    logout
}
