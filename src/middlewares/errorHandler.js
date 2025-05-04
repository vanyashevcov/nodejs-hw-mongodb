export const errorHandler = (error, req, res, next) => {
  console.log(' errorHandler', error);
  const { status = 500, message = 'Something went wrong' } = error;
  res.status(status).json({
    status: status,
    message: 'Something went wrong',
    data: message,
  });
};
