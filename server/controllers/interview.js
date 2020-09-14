/* eslint-disable no-underscore-dangle */
const HttpStatus = require('http-status-codes');
const { DifficultyLevel, Interview } = require('../models/interview');
const { PublishOn } = require('../utils/redis');
const { CreateRedisConnectionMessage } = require('../websockets/helpers');
const InterviewService = require('../services/interviewService');

// return an interview object if it exists
async function getIfExists(path, res) {
  const interview = await Interview.findOne({ path }, { __v: false }).exec();
  // check if interview exists in the database
  if (interview === null) {
    return res.status(HttpStatus.NOT_FOUND).send({
      errors: 'interview not found',
    });
  }
  return interview;
}
// Return question levels list
const GetDifficultyLevelsController = async (req, res) => {
  const levels = await DifficultyLevel.find({}, { __v: false }).exec();

  return res.status(HttpStatus.OK).send(levels);
};

// Create a new interviews on fonction of the title and the difficulty level id
const CreateController = async (req, res) => {
  const level = await DifficultyLevel.findOne({ _id: req.body.level }, { __v: false }).exec();
  if (!level) {
    return res.status(HttpStatus.NOT_FOUND).send({ errors: { level: [`Level ${level} not found!`] } });
  }
  const newInterview = InterviewService.create(req.user, level, req.body.title);

  return res.status(HttpStatus.CREATED).send(newInterview);
};

// get the list of interviews for the connected user
const GetAllController = async (req, res) => {
  const interviews = await InterviewService.GetInterviewsByOwner(req.user._id);

  return res.status(HttpStatus.OK).send(interviews);
};

const JoinController = async (req, res) => {
  const { user } = req;
  const interview = await getIfExists(req.params.path, res);
  // Add the user to list of participants
  InterviewService.join(user, interview);
  // Notify the creator of the interview that another user just join the room
  PublishOn(interview._id.toString(), CreateRedisConnectionMessage(interview, user, 'join'));

  return res.status(HttpStatus.OK).send(interview);
};

const ExitController = async (req, res) => {
  const interview = await getIfExists(req.params.path, res);
  await InterviewService.exit(req.user, interview);
  // Notify the creator of the interview that another user just leave the room
  PublishOn(interview._id.toString(), CreateRedisConnectionMessage(interview, req.user, 'exit'));

  return res.status(HttpStatus.NO_CONTENT).send();
};

const CancelController = async (req, res) => {
  const interview = await getIfExists(req.params.path, res);
  // check if the number of participants does not exceed 1
  if (interview.participants.length === 1) {
    return res.status(HttpStatus.BAD_REQUEST).send({
      errors: 'You can\'t cancel the interview there is a participant in the waitig room',
    });
  }
  interview.isCancelled = true;
  await interview.save();

  return res.status(HttpStatus.OK).send(interview);
};

module.exports = {
  GetDifficultyLevelsController,
  CreateController,
  GetAllController,
  JoinController,
  CancelController,
  ExitController,
};
