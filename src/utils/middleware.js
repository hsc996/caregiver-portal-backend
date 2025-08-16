const { sendError, AppError } = require('../functions/helperFunctions');
const jwt = require("jsonwebtoken")

function errorHandlingMiddleware(err, req, res, next) {
  console.error("ERROR STACK:", err.stack || err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong, please try again later.";

  // Handle mongoose duplicate key errors
  if (err.code === 11000){
    const duplicateField = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field "${duplicateField}": ${err.keyValue[duplicateField]}`;
    statusCode = 400;
  }

  // Handle mongoose ValidationError
  if (err.name === "ValidationError"){
    const messages = Object.values(err.errors).map(e => e.message).join(", ");
    message = `Validation error: ${messages}`
    statusCode = 400;
  }

  // Handle invalid ObjectId casting errors
  if (err.name === "CastError" && err.kind === "ObjectId"){
    message = "Invalid ID format. Must be a 24 character string.";
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message
  });
}

function paginationMiddleware(req, res, next){
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);

    req.pagination = {
        page: Number.isInteger(page) && page > 0 ? page : 1,
        limit: Number.isInteger(limit) && limit > 0 ? limit : 10
    };

    next();
}

function authenticateUser(req, res, next){
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')){
            throw new AppError("Authorization token missing or malformed.", 401);
        }

        const token = authHeader.split(' ')[1];
        
        let payload;
        try {
        payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (jwtError) {
        throw new AppError("Invalid or expired token.", 401);
        }

        req.user = {
            id: payload.id,
            role: payload.role
        };

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    errorHandlingMiddleware,
    paginationMiddleware,
    authenticateUser
}