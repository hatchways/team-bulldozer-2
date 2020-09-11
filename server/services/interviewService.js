/* eslint-disable no-underscore-dangle */
const cryptoRandomString = require('crypto-random-string');
const { PublishOn } = require('../utils/redis');
const { CreateRedisConnectionMessage } = require('../websockets/helpers');
const { Interview } = require('../models/interview');

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
exports.exit = async (user, interview) => {
  const participant = interview.participants.id(user._id);
  // remove the user from the list of particiapants and save if he is not the owner of the interview
  if (participant) {
    interview.participants.pull(user);
    await interview.save();
  }
  // Notify the creator of the interview that another user just leave the room
  PublishOn(interview._id.toString(), CreateRedisConnectionMessage(interview, user, 'exit'));
};
