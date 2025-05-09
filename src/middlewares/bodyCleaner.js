export const bodyCleaner = (req, res, next) => {
  for (const key in req.body) {
    if (req.body[key] === '') {
      delete req.body[key];
    }
  }
  next();
};
