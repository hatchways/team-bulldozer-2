const HttpStatusCode = require('http-status-codes');

module.exports = () => async (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(HttpStatusCode.FORBIDDEN).send({
    errors: 'access denied',
  });
};
