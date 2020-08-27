const mongoose = require('mongoose');

const { Schema } = mongoose;

const { UserSchema } = require('./user');

const DifficultyLevelSchema = new Schema({
  name: String,
});

const InterviewSchema = new Schema({
  participants: [UserSchema],
  level: DifficultyLevelSchema,
  startTime: Date,
  endTime: Date,
  link: String,
  theme: String,
});

const Interview = mongoose.model('Interview', InterviewSchema);
const DifficultyLevel = mongoose.model('DifficultyLevel', DifficultyLevelSchema);

module.exports = { Interview, DifficultyLevel };
