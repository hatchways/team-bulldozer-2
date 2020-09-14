/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const cryptoRandomString = require('crypto-random-string');
const { Interview } = require('../models/interview');
const Question = require('../models/question').QuestionModel;
/**
 * Create a new interview
 * @param {Object} user
 * @param {ObjectId} level
 * @param {String} title
 */
exports.create = async (user, level, title) => {
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

  return interview;
};

/**
 * Return list of interviews by owner id
 * @param {ObjectId} userId
 */
exports.GetInterviewsByOwner = async (userId) => {
  const interviews = await Interview.find({ 'owner._id': userId }, { __v: false }).exec();

  const upcoming = _.filter(interviews, (item) => item.startTime === null
    && item.endTime === null && !item.isCancelled);
  const passed = _.differenceBy(interviews, upcoming, '_id');

  return { upcoming, passed };
};

/**
 * Join a user to the interview room
 * @param {Object} current user object
 * @param {String} interview path
 */
exports.join = async (user, interview) => {
  const questions = await Question.find({ level: interview.level.code });
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  // create a new participant
  const participant = {
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isOwner: user.isOwner,
    question: randomQuestion,
  };
  // Add the new participant to list of interview's participants
  interview.participants.push(participant);
  await interview.save();

  return interview;
};
/**
 * Exit a user from an interview room
 * @param {Object} user
 * @param {Object} interview
 */
exports.exit = async (user, interview) => {
  if (!interview.participants) {
    return;
  }
  const participant = interview.participants.id(user._id);
  // remove the user from the list of particiapants and save if he is not the owner of the interview
  if (participant) {
    interview.participants.pull(user);
    await interview.save();
  }
};
