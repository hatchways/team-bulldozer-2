process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);


// const app = require('../app.js');
