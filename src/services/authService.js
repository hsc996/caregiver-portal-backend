const { UserModel } = require('../models/userModel');
const { CompanyModel } = require('../models/companyModel');
const crypto = require("crypto");
const {
    generateJWT,
    comparePassword,
    generateRefreshToken,
    verifyRefreshToken
} = require('../functions/jwtFunctions');
const { AppError } = require('../functions/helperFunctions');
const { sendPasswordResetEmail } = require('./emailService');


async function signupService({ firstName, lastName, username, email, password, companyName }) {
    if (!firstName || !lastName || !username || !email || !password || !companyName) {
        throw new AppError("Missing required fields.", 400);
    }

    const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        const errorMessage = existingUser.email === email
            ? "This email is already taken."
            : "Username already taken.";
        throw new AppError(errorMessage, 409);
    }

    const company = await CompanyModel.create({ name: companyName.trim(), createdBy: null });

    const newUser = await UserModel.create({
        firstName, lastName, username, email, password,
        role: 'Admin',
        companyId: company._id,
    });

    company.createdBy = newUser._id;
    await company.save();

    const token = generateJWT(newUser._id, newUser.username, newUser.role, newUser.firstName, newUser.lastName, newUser.companyId);
    const refreshToken = generateRefreshToken(newUser._id);
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await UserModel.findByIdAndUpdate(newUser._id, { refreshTokenHash: tokenHash });

    return { user: newUser.toSafeObject(), token, refreshToken };
}


async function joinService({ firstName, lastName, username, email, password, inviteCode }) {
    if (!firstName || !lastName || !username || !email || !password || !inviteCode) {
        throw new AppError("Missing required fields.", 400);
    }

    const company = await CompanyModel.findOne({ inviteCode: inviteCode.trim(), isActive: true });
    if (!company) throw new AppError("Invalid or expired invite code.", 400);

    const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        const errorMessage = existingUser.email === email
            ? "This email is already taken."
            : "Username already taken.";
        throw new AppError(errorMessage, 409);
    }

    const newUser = await UserModel.create({
        firstName, lastName, username, email, password,
        role: 'User',
        companyId: company._id,
    });

    const token = generateJWT(newUser._id, newUser.username, newUser.role, newUser.firstName, newUser.lastName, newUser.companyId);
    const refreshToken = generateRefreshToken(newUser._id);
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await UserModel.findByIdAndUpdate(newUser._id, { refreshTokenHash: tokenHash });

    return { user: newUser.toSafeObject(), token, refreshToken };
}


async function loginUserService({email, password}){
    if (!email || !password){
      throw new AppError("Both email and password are required.", 400);
    }

    const user = await UserModel.findOne({ email: email });
    if (!user){
      throw new AppError("Invalid email or password.", 401);
    }

    if (!user.isActive){
      throw new AppError("This account has been deactivated.", 403);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password.", 401);
    }

    await UserModel.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    const token = generateJWT(user._id, user.username, user.role, user.firstName, user.lastName, user.companyId);
    const refreshToken = generateRefreshToken(user._id);
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await UserModel.findByIdAndUpdate(user._id, { refreshTokenHash: tokenHash });

    return { user: user.toSafeObject(), token, refreshToken };
}



async function requestPasswordResetService({email}){
  if (!email){
    throw new AppError("Email is required.", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validEmail = emailRegex.test(email);
  if (!validEmail){
    throw new AppError("Invalid email format.", 401);
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const user = await UserModel.findOneAndUpdate(
    {email: email},
    {
      $set: {
        passwordResetToken: hashedToken,
        passwordResetExpires: Date.now() + 3600000
      }
    },
    { new: false }
  );
  if (!user){
    return { success: false, message: "If that email exists, a reset link has been sent."}
  }

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await sendPasswordResetEmail(user.email, resetUrl);

  return { message: "An email reset link has been sent."};
}



async function resetPasswordService({token, newPassword}){
  if (!token || !newPassword){
    throw new AppError("Reset token and new password required.", 400);
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user){
    throw new AppError("Invalid or expired reset token.", 400);
  }

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

    const incomingHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    if (!user.refreshTokenHash || user.refreshTokenHash !== incomingHash) {
      throw new AppError("Invalid or revoked refresh token.", 401);
    }

    const newAccessToken = generateJWT(user._id, user.username, user.role, user.firstName, user.lastName, user.companyId);
    const newRefreshToken = generateRefreshToken(user._id);
    const newHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    await UserModel.findByIdAndUpdate(user._id, { refreshTokenHash: newHash });

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

async function logoutService(userId) {
    await UserModel.findByIdAndUpdate(userId, { $set: { refreshTokenHash: null } });
}

module.exports = {
    signupService,
    joinService,
    loginUserService,
    requestPasswordResetService,
    resetPasswordService,
    refreshTokenService,
    logoutService,
}