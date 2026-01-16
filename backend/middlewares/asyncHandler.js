// Async handler wrapper to eliminate try-catch blocks in controllers
// This middleware wraps async route handlers and passes errors to Express error handler
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
