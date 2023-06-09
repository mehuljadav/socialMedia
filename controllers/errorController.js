module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    name: err.name,
    message: err.message,
    err: err,
    err_stack: err.stack,
  });
};
