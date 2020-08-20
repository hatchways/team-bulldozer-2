const chai = require('chai');
const chaiHttp = require('chai-http');
const HttpStatus =  require('http-status-codes');

chai.should();
chai.use(chaiHttp);

const app = require('../app.js');

describe("#Home", () => {
    it('Get Welcome page', (done) => {
        chai.request(app)
        .get('/')
        .end(function(err, res) {
            if(err)
                throw err;
            res.should.have.status(HttpStatus.OK);
            done();
        });
    })
});