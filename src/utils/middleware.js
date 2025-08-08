const { sendError } = require('../functions/helperFunctions');

function errorHandlingMiddleware(err, res, req, next, statusCode){
    console.error(err);

    const status = err.statusCode || 500;
    const message = err.isOperational
    ? err.message
    : 'Something went wrong. Please try again later.';

    return sendError(res, statusCode, message);
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

module.exports = {
    errorHandlingMiddleware,
    paginationMiddleware
}