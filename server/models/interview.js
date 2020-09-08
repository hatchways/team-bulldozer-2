const mongoose = require('mongoose');

const { Schema } = mongoose;

const { BasicUserSchema } = require('./user');

const DifficultyLevelSchema = new Schema({
  name: String,
});

const InterviewSchema = new Schema({
  participants: [BasicUserSchema],
  level: DifficultyLevelSchema,
  startTime: { type: Date, default: null },
  endTime: { type: Date, default: null },
  owner: BasicUserSchema,
  path: String,
  title: String,
  isCancelled: { type: Boolean, default: false },
});

const Interview = mongoose.model('Interview', InterviewSchema);
const DifficultyLevel = mongoose.model('DifficultyLevel', DifficultyLevelSchema);

module.exports = { Interview, DifficultyLevel };
