const { DifficultyLevel } = require('../models/interview');

const data = [
  { name: 'Beginner', code: 1 },
  { name: 'Meduim', code: 2 },
  { name: 'Advanced', code: 3 },
];

exports.canRun = async () => {
  const count = await DifficultyLevel.count().exec();
  return count === 0;
};
exports.run = async () => {
  await DifficultyLevel.create(data);
};
