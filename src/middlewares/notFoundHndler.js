export const notFoundHndler = (req, res) => {
  res.status(404).json({
    message: `${req.url} not found`,
  });
};
