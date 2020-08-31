const HttpStatus = require('http-status-codes');
const _ = require('lodash');
const cryptoRandomString = require('crypto-random-string');
const { DifficultyLevel, Interview } = require('../models/interview');

// Return question levels list
const GetDifficultyLevelsController = async (req, res) => {
  const levels = await DifficultyLevel.find({}, { __v: false }).exec();
  res.status(HttpStatus.OK).send(levels);
};

// Create a new interviews on fonction of the title and the difficulty level id
const CreateController = async (req, res) => {
  const { title } = req.body;

  const level = await DifficultyLevel.findOne({ _id: req.body.level }, { __v: false }).exec();
  if (!level) {
    return res.status(HttpStatus.NOT_FOUND).send({ errors: { level: [`Level ${level} not found!`] } });
  }
  const participants = [req.user];
  const path = cryptoRandomString({ length: 10, type: 'url-safe' });
  const interview = await Interview.create({
    level, title, participants, path,
  });

  return res.status(HttpStatus.CREATED).send(interview);
};

// get the list of interviews for the connected user

const GetAllController = async (req, res) => {
  const currentuser = req.user;
  const interviews = await Interview.find({ participants: currentuser }, { __v: false }).exec();

  const upcoming = _.filter(interviews, (item) => item.startTime === null
    && item.endTime === null && !item.isCancelled);
  const passed = _.differenceBy(interviews, upcoming, '_id');

  return res.status(HttpStatus.OK).send({
    upcoming,
    passed,
  });
};

module.exports = { GetDifficultyLevelsController, CreateController, GetAllController };
