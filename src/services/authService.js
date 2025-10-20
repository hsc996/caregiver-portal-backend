const { UserModel } = require('../models/userModel');
const { 
    generateJWT,
    comparePassword
} = require('../functions/jwtFunctions');
const { AppError } = require('../functions/helperFunctions');


async function registerUserService({ username, email, password}){
    if (!username || !email || !password){
        throw new AppError("Missing required fields.", 400);
    }

    if (password.length < 8){
      throw new AppError("Password must be at least 8 characters long.", 400);
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

    // Generate JWT
    const token = generateJWT(newUser._id, newUser.username, newUser.role);

    return { user: newUser.toSafeObject(), token };
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

    // Create new JWT
    const token = generateJWT(user._id, user.username, user.role);

    return { user: user.toSafeObject(), token};
}

module.exports = {
    loginUserService,
    registerUserService
}