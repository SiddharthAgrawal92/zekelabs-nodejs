const jwt = require('jsonwebtoken');
const verifyToken = require('../src/middlewares/auth.middleware');
require('dotenv').config();

describe('Authorization middleware', () => {
    let mockRequest;
    let mockResponse;
    let nextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            json: jest.fn()
        }
    });

    test('without cookie in the request', () => {
        const expectedResponse = {
            msg: 'Token is required '
        }
        mockRequest = {};
        verifyToken(mockRequest, mockResponse, nextFunction);
        expect(mockResponse.json).toBeCalledWith(expectedResponse);
    })

    test('with cookie in the header', () => {
        const token = jwt.sign({ iss: 'http://localhost: 8081' }, process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY, {
            algorithm: 'HS256',
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
        });
        mockRequest = {
            cookies: {
                access_token: token
            }
        };
        verifyToken(mockRequest, mockResponse, nextFunction);
        expect(nextFunction).toBeCalledTimes(1);
    })

})