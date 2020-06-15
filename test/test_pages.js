var expect = require('chai').expect;
var request = require('request');

describe('Status of pages', function () {
    it('Index page status', function (done) {
        request('http://localhost:3000', function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    it('Bot guide page content', function (done) {
        request('http://localhost:3000/bot-guide', function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    it('Current items page content', function (done) {
        request('http://localhost:3000/current-items', function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    it('Privacy policy page content', function (done) {
        request('http://localhost:3000/privacy-policy', function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    it('Stock updates page content', function (done) {
        request('http://localhost:3000/stock-updates', function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    it('Terms page content', function (done) {
        request('http://localhost:3000/terms', function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
});
