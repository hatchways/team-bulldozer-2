/* eslint-disable no-underscore-dangle */
const HttpStatus = require('http-status-codes');
const _ = require('lodash');
const cryptoRandomString = require('crypto-random-string');
const { DifficultyLevel, Interview } = require('../models/interview');
const { PublishOn } = require('../utils/redis');
const { CreateRedisMessage } = require('../websockets/helpers');

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
  const { user } = req;
  const owner = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    _id: user._id,
    isOwner: true,
  };
  const path = cryptoRandomString({ length: 10, type: 'url-safe' });
  const interview = await Interview.create({
    level, title, owner, path,
  });

  return res.status(HttpStatus.CREATED).send(interview);
};

// get the list of interviews for the connected user

const GetAllController = async (req, res) => {
  const currentuser = req.user;
  const interviews = await Interview.find({ 'owner._id': currentuser._id }, { __v: false }).exec();

  const upcoming = _.filter(interviews, (item) => item.startTime === null
    && item.endTime === null && !item.isCancelled);
  const passed = _.differenceBy(interviews, upcoming, '_id');

  return res.status(HttpStatus.OK).send({
    upcoming,
    passed,
  });
};

const JoinController = async (req, res) => {
  const { path } = req.params;
  const { user } = req;

  const interview = await Interview.findOne({ path }, { __v: false }).exec();
  // check if interview exists in the database
  if (interview === null) {
    return res.status(HttpStatus.NOT_FOUND).send({
      errors: 'interview not found',
    });
  }
  // check if the user is not already joined the room
  if (interview.participants.id(user._id) !== null) {
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
  PublishOn(interview._id.toString(), CreateRedisMessage(interview, user, 'join'));
  return res.status(HttpStatus.OK).send(interview);
};

const ExitController = async (req, res) => {
  const { path } = req.params;
  const { user } = req;

  const interview = await Interview.findOne({ path }, { __v: false }).exec();
  // check if interview exists in the database
  if (interview === null) {
    return res.status(HttpStatus.NOT_FOUND).send({
      errors: 'interview not found',
    });
  }
  const participant = interview.participants.id(user._id);
  // remove the user from the list of particiapants and save if he is not the owner of the interview
  if (participant) {
    interview.participants.pull(user);
    await interview.save();
  }
  // Notify the creator of the interview that another user just leave the room
  PublishOn(interview._id.toString(), CreateRedisMessage(interview, user, 'exit'));
  return res.status(HttpStatus.NO_CONTENT).send();
};

module.exports = {
  GetDifficultyLevelsController,
  CreateController,
  GetAllController,
  JoinController,
  ExitController,
};
