// global error handler so server does not crash unexpectedly
function errorHandler(err, req, res, next) {
  console.error('API Error:', err.message || err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Something went sideways on the server';

  res.status(statusCode).json({
    error: message,
  });
}

module.exports = errorHandler;
