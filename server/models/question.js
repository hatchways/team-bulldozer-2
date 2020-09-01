const mongoose = require('mongoose');

const { Schema } = mongoose;

const QuestionSchema = new Schema({
  body: String,
});
const QuestionModel = mongoose.model('Question', QuestionSchema);

module.exports = { QuestionModel, QuestionSchema };
