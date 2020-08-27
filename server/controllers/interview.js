const HttpStatus = require('http-status-codes');
const { DifficultyLevel } = require('../models/interview');

const GetInterviewDificulityLevels = async (req, res) => {
  const levels = await DifficultyLevel.find({}, { __v: false }).exec();
  res.status(HttpStatus.OK).send(levels);
};

module.exports = { GetInterviewDificulityLevels };
