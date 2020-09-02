const HttpStatus = require('http-status-codes');
const {
  validUser,
  userWithInvalidPassword,
  userWithEmptyFisrtName,
  invalidCredentials,
  validCredentials,
} = require('./mocks/user');

const {
  AssertGetRequest,
  AssertPostRequest,
  AssertSecuredGetRequest,
} = require('./utils/setup');

const User = require('../models/user').UserModel;

describe('Authentication controller', () => {
  describe('#SignUp', () => {
    before(async () => {
      await User.deleteMany({});
    });
    it('Should return 400 when passing a not valid password', (done) => {
      AssertPostRequest(
        '/auth/register',
        userWithInvalidPassword,
        HttpStatus.BAD_REQUEST,
        done,
      );
    });

    it('Should return 400 when passing an empty value for firstName', (done) => {
      AssertPostRequest(
        '/auth/register',
        userWithEmptyFisrtName,
        HttpStatus.BAD_REQUEST,
        done,
      );
    });

    it('Should return 201 after creating a new user', (done) => {
      AssertPostRequest('/auth/register',
        validUser,
        HttpStatus.CREATED,
        done,
        async () => {
          const count = await User.countDocuments().exec();
          count.should.equal(1);
        });
    });

    it('Should return 409 after passing an exist user', (done) => {
      AssertPostRequest('/auth/register', validUser, HttpStatus.CONFLICT, done);
    });
  });

  describe('#Login', () => {
    before(async () => {
      await User.deleteMany({});
      await User.create(validUser);
    });
    it('Should return 401 after log in with  invalid credentials', (done) => {
      AssertPostRequest(
        '/auth/login',
        invalidCredentials,
        HttpStatus.UNAUTHORIZED,
        done,
      );
    });
    it('Should return 200 after log in a valid user', (done) => {
      AssertPostRequest('/auth/login', validCredentials, HttpStatus.OK, done);
    });
  });

  describe('#Me Get current connected user', () => {
    before(async () => {
      await User.deleteMany({});
      await User.create(validUser);
    });
    it('Should return 403 when trying to get data with not connected user', (done) => {
      AssertGetRequest('/auth/me', HttpStatus.FORBIDDEN, done);
    });
    it('Should return 200 http status code', (done) => {
      AssertSecuredGetRequest('/auth/me', HttpStatus.OK, done);
    });
  });
});
