const mongoose = require('mongoose');
const DifficultyLevelsSeeder = require('./difficulty-level');
const QuestionSeeder = require('./question');

async function dbseed() {
// Connect to the database
  mongoose.connect(process.env.DB_CONNECTION || 'mongodb://localhost:27017/hatchways', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const seeders = [
    DifficultyLevelsSeeder,
    QuestionSeeder,
  ];

  seeders.forEach(async (seeder) => {
    if (await seeder.canRun()) {
      await seeder.run();
    }
  });
}
dbseed();
// dbseed().then(() => process.exit(1));
