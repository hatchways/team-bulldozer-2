const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send({ welcomeMessage: 'Step 1 (completed)' });
});

module.exports = router;
