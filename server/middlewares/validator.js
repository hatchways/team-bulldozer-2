const { validationResult } = require('express-validator');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

module.exports = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  let errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  errors = _(errors.array())
    .groupBy('param')
    .mapValues((group) => _.map(group, 'msg'))
    .value();

  res.status(HttpStatus.BAD_REQUEST).json({ errors });
};
