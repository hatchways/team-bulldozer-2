const express = require('express');

const router = express.Router();
const IsLoggedIn = require('../middlewares/isLoggedIn');
const Validator = require('../middlewares/validator');
const { Interview } = require('../validations/interviewSchema');
const {
  GetDificulityLevelsController,
  CreateController, GetAllController,
} = require('../controllers/interview');

router.get('/difficulty-levels', IsLoggedIn(), GetDificulityLevelsController);
router.post('/', IsLoggedIn(), Validator(Interview), CreateController);
router.get('/', IsLoggedIn(), GetAllController);

module.exports = router;
