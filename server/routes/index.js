const express = require('express');

const router = express.Router();
const homeRouter = require('./home')(router);
const authRouter = require('./auth')(router);
const interviewRouter = require('./interview')(router);

module.exports = (app) => {
  app.use('/auth', authRouter);
  app.use('/', homeRouter);
  app.use('/', interviewRouter);

  return app;
};
