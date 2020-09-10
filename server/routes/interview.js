const express = require('express');

const router = express.Router();
const IsLoggedIn = require('../middlewares/isLoggedIn');
const Validator = require('../middlewares/validator');
const { Interview } = require('../validations/interviewSchema');
const {
  GetDifficultyLevelsController,
  CreateController,
  GetAllController,
  JoinController,
  ExitController,
} = require('../controllers/interview');

router.get('/difficulty-levels', IsLoggedIn(), GetDifficultyLevelsController);
router.post('/', IsLoggedIn(), Validator(Interview), CreateController);
router.get('/', IsLoggedIn(), GetAllController);
router.get('/:path/join', IsLoggedIn(), JoinController);
router.get('/:path/exit', IsLoggedIn(), ExitController);

module.exports = router;
