const { UserModel } = require('../models/userModel');
const crypto = require("crypto");
const { 
    generateJWT,
    comparePassword,
    generateRefreshToken,
    verifyRefreshToken
} = require('../functions/jwtFunctions');
const { AppError } = require('../functions/helperFunctions');
const { sendPasswordResetEmail } = require('./emailService');


async function registerUserService({ username, email, password}){
    if (!username || !email || !password){
        throw new AppError("Missing required fields.", 400);
    }

     // Check if username or email already exists
    const existingUser = await UserModel.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (existingUser) {
      const errorMessage =
        existingUser.email === email
          ? "This email is already taken."
          : "Username already taken.";
      throw new AppError(errorMessage, 409);
    }

    // Create new user
    let newUser = await UserModel.create({
      username: username,
      email: email,
      password: password,
      role: 'User'
    });

    // Generate JWT + refresh token
    const token = generateJWT(newUser._id, newUser.username, newUser.role);
    const refreshToken = generateRefreshToken(newUser._id);

    return { user: newUser.toSafeObject(), token, refreshToken };
}


async function loginUserService({email, password}){
    if (!email || !password){
      throw new AppError("Both email and password are required.", 400);
    }

    // Search for user by email
    const user = await UserModel.findOne({ email: email });
    if (!user){
      throw new AppError("Invalid email or password.", 401);
    }

    if (!user.isActive){
      throw new AppError("This account has been deactivated.", 403);
    }

    // Check if password is valid (compare passwords)
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password.", 401);
    }

    // Save date as last log in
    user.lastLogin = new Date();
    await user.save();

    // Create new JWT + refresh token
    const token = generateJWT(user._id, user.username, user.role);
    const refreshToken = generateRefreshToken(user._id);

    return { user: user.toSafeObject(), token, refreshToken };
}



async function requestPasswordResetService({email}){
  if (!email){
    throw new AppError("Email is required.", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validEmail = emailRegex.test(email);
  if (!validEmail){
    throw new AppError("Inavlid email format.", 401);
  }

  const user = await UserModel.findOne({email: email});
  if (!user){
    return { success: false, message: "User not found."}
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Save hashed token + expiry to user
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const savedUser = await UserModel.findOne({email: email});

  // Send reset email link
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await sendPasswordResetEmail(user.email, resetUrl);

  return { message: "An email reset link has been sent."};
}



async function resetPasswordService({token, newPassword}){
  if (!token || !newPassword){
    throw new AppError("Reset token and new password required.", 400);
  }

  // Hash the token in the URLto compared w stored hash
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  //Find user with valid token that hasn't expired
  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user){
    throw new AppError("Invalid or expired reset token.", 400);
  }

  // Hash new password and update user
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.lastPasswordChange = new Date();

  await user.save();

  return { message: "Password successfully reset." };
}


async function refreshTokenService({ refreshToken }){
  if (!refreshToken){
    throw new AppError("Refresh token required.", 401);
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    if (decoded.type !== "refresh"){
      throw new AppError("Invalid token type", 401);
    }

    const user = await UserModel.findById(decoded.id);
    if (!user){
      throw new AppError("User not found.", 404);
    }
    if (!user.isActive){
      throw new AppError("This account has been deactivated.", 403);
    }

    const newAccessToken = generateJWT(user._id, user.username, user.role);
    const newRefreshToken = generateRefreshToken(user._id);

    return {
      token: newAccessToken,
      refreshToken: newRefreshToken
    }
  } catch (error) {
    if (error instanceof AppError){
      throw error;
    }
    throw new AppError(error.message || "Token refresh failed.", 401);
  }
}


module.exports = {
    loginUserService,
    registerUserService,
    requestPasswordResetService,
    resetPasswordService,
    refreshTokenService
}