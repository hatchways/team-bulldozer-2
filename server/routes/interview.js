const IsLoggedIn = require('../middlewares/isLoggedIn');
const {
  GetInterviewDificulityLevels,
} = require('../controllers/interview');

module.exports = (router) => {
  router.get('/dificulitys-levels', IsLoggedIn(), GetInterviewDificulityLevels);

  return router;
};
