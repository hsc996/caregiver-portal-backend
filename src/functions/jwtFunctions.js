const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let jwtSecretKey = process.env.JWT_SECRET_KEY;
let saltRounds = 12;

function generateJWT(userId, username, role){
    if (!userId || !role){
        throw new Error("User ID and role are required for JWT generation.")
    }
    return jwt.sign(
        {
            id: userId,
            username: username,
            role: role
        },
        jwtSecretKey,
        {
            expiresIn: "15m"
        }
    );
}

function generateRefreshToken(userId){
    if (!userId){
        throw new Error("User ID is required for refresh token generation.")
    }

    return jwt.sign(
        { id: userId, type: "refresh" },
        process.env.REFRESH_SECRET_TOKEN || jwtSecretKey,
        { expiresIn: "7d" }
    );
}

function verifyRefreshToken(token){
    try {
        return jwt.verify(token, process.env.REFRESH_SECRET_TOKEN || jwtSecretKey);
    } catch (error) {
        throw new Error("Invalid or expired refresh token.");
    }
}

async function hashPassword(password){
    return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(providedPW, storedPW){
    if (!providedPW || !storedPW){
        throw new Error("Both provided and stored passwords are required for comparison.");
    }

    return await bcrypt.compare(providedPW, storedPW);
}

module.exports = {
    generateJWT,
    hashPassword,
    comparePassword,
    generateRefreshToken,
    verifyRefreshToken
}