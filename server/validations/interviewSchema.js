const { body } = require('express-validator');
const { ObjectId } = require('mongoose').Types;

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

exports.Interview = [
  InterviewSchema.level,
  InterviewSchema.title,
];
