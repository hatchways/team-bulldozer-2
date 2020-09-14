/* eslint-disable no-underscore-dangle */
const { body, param } = require('express-validator');
const { ObjectId } = require('mongoose').Types;
const { Interview } = require('../models/interview');

const InterviewSchema = {
  level: body('level')
    .notEmpty()
    .withMessage('Level is required')
    .custom((value) => ObjectId.isValid(value))
    .withMessage('Invalid level value'),
  title: body('title')
    .isString()
    .withMessage('Invalid theme value')
    .notEmpty()
    .withMessage('Theme is required'),
};

async function canJoinRoom(path, req) {
  const userId = req.user._id;
  const interview = await Interview.findOne({ path }, { __v: false }).exec();
  // check if the user is not already joined the room
  if (interview.participants.id(userId) !== null) {
    throw new Error('the user is already joined');
  }
  // check if the number of participants does not exceed 2
  if (interview.participants.length === 2) {
    throw new Error('Number of participants reach his limit');
  }
  // check only the owner of interview can join the room if the room already have an participant
  if (interview.participants.length === 1) {
    if (interview.owner._id !== userId && interview.participants[0]._id === userId) {
      throw new Error('Interview already have a participant only the creator of the interview can join the room');
    }
  }

  return true;
}

const JoinInterviewSchema = {
  path: param('path')
    .notEmpty()
    .withMessage('Level is required')
    .custom((value, { req, loc, path }) => canJoinRoom(value, req)),
};

exports.Interview = [
  InterviewSchema.level,
  InterviewSchema.title,
];

exports.JoinInterview = [JoinInterviewSchema.path];
