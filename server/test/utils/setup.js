/* eslint-disable import/no-extraneous-dependencies */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const pathResolver = require('path');
const chaiHttp = require('chai-http');

const { validCredentials } = require('../mocks/user');

chai.should();
chai.use(chaiHttp);

const dotEnvPath = pathResolver.resolve(`${__dirname}./../../.env`);
require('dotenv').config({ path: dotEnvPath });

const app = require('../../app.js');

exports.AssertPostRequest = (path, payload, expectedStatusCode, done, assert = {}) => {
  chai.request(app)
    .post(path)
    .send(payload)
    .end(async (err, res) => {
      if (err) throw err;
      try {
        res.should.have.status(expectedStatusCode);
        if (typeof assert === 'function') {
          await assert();
        }
      } catch (e) {
        return done(e);
      }
      return done();
    });
};

exports.AssertGetRequest = (path, expectedStatusCode, done, assert = {}) => {
  chai.request(app)
    .get(path)
    .end(async (err, res) => {
      if (err) throw err;
      try {
        res.should.have.status(expectedStatusCode);
        if (typeof assert === 'function') {
          await assert();
        }
      } catch (e) {
        return done(e);
      }
      return done();
    });
};

exports.AssertSecuredGetRequest = (path, expectedStatusCode, done, assert = {}) => {
  const httpChaiAgent = chai.request.agent(app);
  httpChaiAgent
    .post('/auth/login')
    .send(validCredentials)
    .end((err) => {
      if (err) throw err;
      httpChaiAgent
        .get(path)
        .end(async (error, result) => {
          if (error) throw error;
          try {
            result.should.have.status(expectedStatusCode);
            if (typeof assert === 'function') {
              await assert();
            }
          } catch (e) {
            httpChaiAgent.close();
            return done(e);
          }
          httpChaiAgent.close();
          return done();
        });
    });
};
