process.env.NODE_ENV = 'test';

const chai = require('chai');
const path = require('path');
const chaiHttp = require('chai-http');

const {validCredentials} = require('../mocks/user')

chai.should();
chai.use(chaiHttp);

const dotEnvPath = path.resolve(__dirname + './../../.env');
require('dotenv').config({ path: dotEnvPath });

const app = require('../../app.js');

exports.AssertPostRequest = (path , payload, expectedStatusCode, done) => {
    chai.request(app)
    .post(path)
    .send(payload)
    .end((err, res) => {
        if(err)
            throw err;
        res.should.have.status(expectedStatusCode);
        done();
    });
}

exports.AssertGetRequest = (path, expectedStatusCode, done) => {
    chai.request(app)
        .get(path)
        .end(function(err, res) {
            if(err)
                throw err;   
            res.should.have.status(expectedStatusCode);
            done();
        });
}

exports.AssertSecuredGetRequest = (path, expectedStatusCode, done) => {
    const httpChaiAgent = chai.request.agent(app);
            httpChaiAgent
                .post('/auth/login')
                .send(validCredentials)
                .end((err, res) => {
                    if(err)
                        throw err;
                    httpChaiAgent
                        .get(path)   
                        .end(function(error, result) {
                            if(error)
                                throw error;
                            result.should.have.status(expectedStatusCode);
                            httpChaiAgent.close(); 
                            done();
                        }); 
                });
               
}