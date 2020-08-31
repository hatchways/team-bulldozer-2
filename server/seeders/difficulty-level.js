const { DifficultyLevel } = require('../models/interview');

const data = [
  { name: 'Beginner' },
  { name: 'Meduim' },
  { name: 'Advanced' },
  { name: 'Very Advanced' },
];

exports.canRun = async () => {
  const count = await DifficultyLevel.count().exec();
  return count === 0;
};
exports.run = async () => {
  await DifficultyLevel.create(data);
};
