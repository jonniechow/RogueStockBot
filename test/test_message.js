var expect = require('chai').expect;
var request = require('request');
var supertest = require('supertest')
var api = supertest('http://localhost:3000')

describe('Request', function () {
    it('Pages are working', function (done) {
        api.get('/webhook').expect(200);
        api.get('/').expect(200);
        api.get('/terms').expect(200);
        api.get('/current-items').expect(200);
        api.get('/stock-updates').expect(200);
        done();
    });


});