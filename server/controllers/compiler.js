const HttpStatus = require('http-status-codes');
const sanboxService = require('../dockerSandbox/service');

exports.Compile = (req, res) => {
  const { language, code, stdin } = req.body;
  sanboxService.compile(language, code, stdin, (result) => res.status(HttpStatus.OK).send(result));
};
