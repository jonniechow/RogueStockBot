var expect  = require('chai').expect;
var request = require('request');

it('Main page status', function(done) {
    request('http://localhost:3000' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});

it('Bot guide page content', function(done) {
    request('http://localhost:3000/bot-guide' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});