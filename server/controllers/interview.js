/* eslint-disable no-underscore-dangle */
const HttpStatus = require('http-status-codes');
const _ = require('lodash');
const cryptoRandomString = require('crypto-random-string');
const { DifficultyLevel, Interview } = require('../models/interview');
const { PublishOn } = require('../utils/redis');

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

const GetByPathController = async (req, res) => {
  const { path } = req.params;
  const interview = await Interview.findOne({ path }, { __v: false }).exec();
  return res.status(HttpStatus.OK).send(interview);
};

const JoinController = async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  const interview = await Interview.findOne({ _id: id }, { __v: false }).exec();
  // check if interview exists in the database
  if (interview === null) {
    return res.status(HttpStatus.NOT_FOUND).send({
      errors: 'interview not found',
    });
  }
  // check if the user is not already joined the room
  const isParticipantExists = _.filter(interview.participants,
    (item) => item._id.toString() === user._id.toString()).length > 0;

  if (isParticipantExists) {
    return res.status(HttpStatus.BAD_REQUEST).send({
      errors: 'the user is already joined',
    });
  }
  // check if the number of participants does not exceed 2
  if (interview.participants.length === 2) {
    return res.status(HttpStatus.BAD_REQUEST).send({
      errors: 'Number of participants reach his limit',
    });
  }
  // Add the current use to list of interview's participants
  interview.participants.push(user);
  await interview.save();
  // Notify the creator of the interview that another user just join the room
  PublishOn(interview._id.toString(), `${user.firstName} ${user.lastName}`);
  return res.status(HttpStatus.OK).send(interview);
};

module.exports = {
  GetDifficultyLevelsController,
  CreateController,
  GetAllController,
  GetByPathController,
  JoinController,
};
