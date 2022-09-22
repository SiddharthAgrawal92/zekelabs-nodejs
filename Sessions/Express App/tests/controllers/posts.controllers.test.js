const { expect } = require('chai');
const chai = require('chai');
let chaiHttp = require('chai-http');
const server = require('../../src/server');
const jwt = require('jsonwebtoken');

//Assertion style
chai.should();
chai.use(chaiHttp);

describe('/posts endpoint', () => {
    describe('GET /posts', () => {
        it('should get all posts', done => {
            const token = jwt.sign({ iss: 'http://localhost: 8081' }, process.env.TEST_JWT_ACCESS_TOKEN_PRIVATE_KEY, {
                algorithm: 'HS256',
                expiresIn: process.env.TEST_JWT_ACCESS_TOKEN_EXPIRES_IN
            });
            chai.request(server).get('/posts').set('Cookie', `access_token=${token}`).set('from', 'Mocha-Test').end((err, response) => {
                // response.should.have.status(200);
                // response.body.should.be.an('object');
                // response.body.result.should.be.an('array');
                expect(err).to.be.null;
                expect(response).to.have.status(200);
                expect(response.body).to.be.a('object');
                expect(response.body.result).to.be.a('array');
                response.body.result.length.should.be.greaterThan(0);
                done();
            })
        })
    })
})