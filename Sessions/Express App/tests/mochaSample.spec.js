const { expect } = require("chai");
const myList = [1, 2, 3, 4, 5];
const crypto = require('crypto');

const generateHash = (value, callback) => {
    let fnCallback = typeof callback === 'function';
    try {
        const hashValue = crypto.createHash('md5').update(value).digest('hex');
        fnCallback && callback(null, hashValue);
    } catch (e) {
        if (fnCallback) callback(e);
        else throw e;
    }
}

describe('check md5 hash value', () => {
    context('with a string value', () => {
        it('should compute the md5 hash value', () => {
            generateHash('siddharth', (err, data) => {
                if (err) throw err;
                expect(data).to.be.a('string').and.equal('f72e9a1ac26eb390ef16669c43bac7f3');
            })
        });
    })
})

describe('check array', () => {
    it('is an array', () => {
        expect(myList).to.be.an('array').that.includes(2);
    });
});