const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let jwtSecretKey = process.env.JWT_SECRET_KEY;
let saltRounds = 10;

function generateJWT(userId, username, role = null){
    return jwt.sign(
        {
            userId: userId,
            username: username
        },
        jwtSecretKey,
        {
            expiresIn: "7d"
        }
    );
}

function decodeJWT(tokenToDecode){
    try {
        return jwt.verify(tokenToDecode, jwtSecretKey);
    } catch (error) {
        console.error("JWT verification failed: " + error);

        if (error.name === 'TokenExpiredError'){
            throw new Error("Token has expired.");
        }
        throw new Error("Invalid or expired token.")
    }
}

async function hashPassword(password){
    return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(providedPW, storedPW){
    return await bcrypt.compare(providedPW, storedPW);
}

module.exports = {
    generateJWT,
    decodeJWT,
    hashPassword,
    comparePassword
}