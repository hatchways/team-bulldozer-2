const mongoose = require('mongoose');

const { Schema } = mongoose;

const QuestionSchema = new Schema({
  level: Number,
  body: String,
  title: String,
});
const QuestionModel = mongoose.model('Question', QuestionSchema);

module.exports = { QuestionModel, QuestionSchema };
