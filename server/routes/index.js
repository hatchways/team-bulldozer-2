const homeRouter = require('./home');
const authRouter = require('./auth');
const interviewRouter = require('./interview');

module.exports = (app) => {
  app.use('/auth', authRouter);
  app.use('/interviews', interviewRouter);
  app.use('/', homeRouter);

  return app;
};
