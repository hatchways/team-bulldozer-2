const HttpStatus = require('http-status-codes');
const sanboxService = require('../dockerSandbox/service');
const { PublishOn } = require('../utils/redis');
const { CreateRedisCodeCompilationMessage } = require('../websockets/helpers');

exports.Compile = (req, res) => {
  const {
    language, code, stdin, interviewId,
  } = req.body;

  sanboxService.compile(language, code, stdin, (result) => {
    // notify the room of the interview that the compilation is completed
    PublishOn(interviewId.toString(), CreateRedisCodeCompilationMessage(interviewId, result, 'onConsoleChange'));
    // return a response with compilation details
    res.status(HttpStatus.OK).send(result);
  });
};
