const { AppError } = require("../functions/helperFunctions");
const jwt = require("jsonwebtoken");

function errorHandlingMiddleware(err, req, res, next) {
  console.error("ERROR STACK:", err.stack || err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong, please try again later.";

  // Handle mongoose duplicate key errors
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field "${duplicateField}": ${err.keyValue[duplicateField]}`;
    statusCode = 409;
  }

  // Handle mongoose ValidationError
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    message = `Validation error: ${messages}`;
    statusCode = 400;
  }

  // Handle invalid ObjectId casting errors
  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = "Invalid ID format. Must be a 24 character hex string.";
    statusCode = 400;
  }

  // Handle token expired error
  if (err.name === "TokenExpiredError") {
    message = "Authentication token has expired.";
    statusCode = 401;
  }

  // Handle JWT error
  if (err.name === "JsonWebTokenError"){
    message = "Invalid authentication token.";
    statusCode = 401;
  }
  if (statusCode === 500 && process.env.NODE_ENV === "production") {
    message = "Internal server error. Please try again later.";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

function paginationMiddleware(req, res, next) {
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);

  req.pagination = {
    page: Number.isInteger(page) && page > 0 ? page : 1,
    limit: Number.isInteger(limit) && limit > 0 ? limit : 10,
  };

  req.pagination.skip = (req.pagination.page - 1) * req.pagination.limit;

  next();
}

function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authorization token missing or malformed.", 401);
    }

    const token = authHeader.split(" ")[1];

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (jwtError) {
      throw new AppError("Invalid or expired token.", 401);
    }

    req.user = {
      id: payload.id,
      username: payload.username,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required.", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Required roles: ${allowedRoles.join(", ")}`,
          403
        )
      );
    }

    next();
  };
}

function authorizeOwnerorAdmin(req, res, next) {
  if (!req.user) {
    return next(new AppError("Authentication required.", 401));
  }

  const resourceId = req.params.id || req.params.userId;
  const isOwner = req.user.id.toString() === resourceId.toString();
  const isAdmin = req.user.role === "Admin";

  if (!isOwner && !isAdmin) {
    return next(
      new AppError(
        "Unauthorized: You can only access your own resources or must be an admin.",
        403
      )
    );
  }

  next();
}

module.exports = {
  errorHandlingMiddleware,
  paginationMiddleware,
  authenticateUser,
  authorizeRoles,
  authorizeOwnerorAdmin
};
