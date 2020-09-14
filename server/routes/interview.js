const express = require('express');

const router = express.Router();
const IsLoggedIn = require('../middlewares/isLoggedIn');
const Validator = require('../middlewares/validator');
const { Interview, JoinInterview } = require('../validations/interviewSchema');
const {
  GetDifficultyLevelsController,
  CreateController,
  GetAllController,
  JoinController,
  CancelController,
  ExitController,
} = require('../controllers/interview');

router.get('/difficulty-levels', IsLoggedIn(), GetDifficultyLevelsController);
router.post('/', IsLoggedIn(), Validator(Interview), CreateController);
router.get('/', IsLoggedIn(), GetAllController);
router.get('/:path/join', IsLoggedIn(), Validator(JoinInterview), JoinController);
router.get('/:path/cancel', IsLoggedIn(), CancelController);
router.get('/:path/exit', IsLoggedIn(), ExitController);

module.exports = router;
