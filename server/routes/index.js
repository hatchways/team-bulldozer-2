const homeRouter = require('./home');
const authRouter = require('./auth');
const interviewRouter = require('./interview');
const compilerRouter = require('./compiler');

module.exports = (app) => {
  app.use('/auth', authRouter);
  app.use('/interviews', interviewRouter);
  app.use('/', homeRouter);
  app.use('/compile', compilerRouter);
  return app;
};
