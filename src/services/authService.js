const { UserModel } = require('../models/userModel');
const { 
    generateJWT,
    hashPassword,
    comparePassword
} = require('../functions/jwtFunctions');
const { AppError } = require('../functions/helperFunctions');


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

    // Hash the password
    const hashedPw = await hashPassword(password);

    // Create new user
    let newUser = await UserModel.create({
      username: username,
      email: email,
      password: hashedPw,
    });

    // Generate JWT
    const token = generateJWT(newUser._id, newUser.username);

    const safeUser = newUser.toObject();
    delete safeUser.password;

    return { user: safeUser, token };
}

async function loginUserService({email, password}){
    // Search for user by email
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      throw new AppError(
        "This email has not been registered yet. Please sign up first."
      );
    }

    // Check if password is valid (compare passwords)
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      console.log("Incorrect password attempt");
      throw new AppError("Invalid password");
    }

    // Create new JWT
    const token = generateJWT(user._id, user.username);

    // Remove sensitive user information
    const safeUser = user.toObject();
    delete safeUser.password;

    return { user: safeUser, token };
}

module.exports = {
    loginUserService,
    registerUserService
}