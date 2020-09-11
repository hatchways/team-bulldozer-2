/* eslint-disable radix */
/* eslint-disable array-callback-return */
/* eslint-disable no-return-assign */
const { QuestionModel } = require('../models/question');

const { fetchTopQuestions, fetchQuestionDetails } = require('./helper');

exports.canRun = () => true;

exports.run = async () => {
  await QuestionModel.deleteMany({});
  fetchTopQuestions(((err, data) => {
    if (err) { throw err; }
    data.map((question) => {
      fetchQuestionDetails(question.slug, async (err2, data2) => {
        if (err2) { throw err2; }
        if (data2.content !== null) {
          await QuestionModel.create({
            level: parseInt(question.difficulty),
            body: data2.content,
            title: data2.title,
          });
        }
      });
    });
  }));
};
