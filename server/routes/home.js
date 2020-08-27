module.exports = (router) => {
  router.get('/', (req, res) => {
    res.status(200).send({ welcomeMessage: 'Step 1 (completed)' });
  });

  return router;
};
