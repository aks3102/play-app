// Handle errors appropriately
exports.errorResponse = (res, message, statusCode = 500, error = {}) => {
    res.status(statusCode).json({
      success: false,
      message,
      error: {
        statusCode,
        message,
        error,
      },
    });
  };
  
  // you can call the function as shown below
  // Passing the response object, message, status code, and success action
  errorResponse(res, 'Not found', 404, false); 