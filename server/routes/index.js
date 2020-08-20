module.exports = (app) => {

  const express = require("express");
  const router = express.Router(); 

  const homeRouter = require('./home')(router);
  const authRouter = require('./auth')(router);

  
  app.use("/auth", authRouter);
  app.use("/", homeRouter);

  return app;
}


