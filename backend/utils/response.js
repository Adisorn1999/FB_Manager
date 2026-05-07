exports.success = (res, data = null, message = 'OK', status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    error: null
  });
};

exports.error = (res, message = 'Error', error = null, status = 500) => {
  return res.status(status).json({
    success: false,
    message,
    data: null,
    error
  });
};