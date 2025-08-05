const { UserModel } = require('../models/userModel');
const { 
    generateJWT,
    hashPassword,
    comparePassword
} = require('../functions/jwtFunctions');

/** 
 * Controller to handle user account registration
 * @param {Request} req
 * @param {Response} res 
*/

async function signup(req, res) {
  try {
    // Extract username, email and password from request body
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !password || !email) {
      throw new Error("Missing required fields.");
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
      throw new Error(errorMessage);
    }

    // Hash the password
    const hashedPw = await hashPassword(password);

    // Create new user
    let newUser = await UserModel.create({
      username: username,
      email: email,
      password: hashedPw,
    });

    console.log(
      `New user created successfully: ${newUser.username} (${newUser.email})`
    );

    // Generate JWT
    const token = generateJWT(newUser._id, newUser.username);

    const safeUser = newUser.toObject();
    delete safeUser.password;

    // Return user data
    res.status(201).json({
      message: "User created successfully",
      user: safeUser,
      token: token,
    });
  } catch (error) {
    console.error(`An error occurred while creating user: ${error.message}`);
    throw new Error("Unable to register new user.");
  }
}



/** 
 * Controller to handle user sign in
 * @param {Request} req
 * @param {Response} res 
*/

async function signin(req, res) {
  try {
    const { email, password } = req.body;

    // Search for user by email
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      throw new Error(
        "This email has not been registered yet. Please sign up first."
      );
    }

    // Check if password is valid (compare passwords)
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      console.log("Incorrect password attempt");
      throw new Error("Invalid password");
    }

    // Create new JWT
    const token = generateJWT(user._id, user.username);

    // Remove sensitive user information
    const safeUser = user.toObject();
    delete safeUser.password;

    // Return user data
    res.status(200).json({
      message: "User successfully signed in.",
      user: safeUser,
      token: token,
    });
  } catch (error) {
    console.error(`An error occurred during sign-in: ${error.message}`);
    throw new Error("Unable to sign in at this time.");
  }
}


module.exports = {
    signin,
    signup
}