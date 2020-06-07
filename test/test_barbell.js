var expect = require('chai').expect;
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var should = require('should');
var axios = require('axios');
var afterLoad = require('after-load');
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: false });

describe('Barbell', function () {
    it(`Test product name`, function (done) {
        this.timeout(5000);
        request.get('https://www.roguefitness.com/rogue-45lb-ohio-power-bar-stainless', function (err, response, body) {
            response.statusCode.should.equal(200);
            let $ = cheerio.load(body);
            expect($('.product-title').text()).to.equal(`Rogue 45LB Ohio Power Bar - Stainless Steel`);
            done();
        })
    });
    it(`Test price`, function (done) {
        request.get('https://www.roguefitness.com/rogue-45lb-ohio-power-bar-stainless', function (err, response, body) {
            let $ = cheerio.load(body);
            expect($('.price').text()).to.equal(`$395.00`);
            done();
        })
    });
    it(`Test rogue 2.0 avail`, function (done) {
        request.get('https://www.roguefitness.com/the-rogue-bar-2-0', function (err, response, body) {
            let $ = cheerio.load(body);
            expect($('.bin-stock-availability').text()).to.have.string(`Notify Me`);
            done();
        })
    });
    it(`Test opb ss avail`, function (done) {
        request.get('https://www.roguefitness.com/rogue-45lb-ohio-power-bar-stainless', function (err, response, body) {
            let $ = cheerio.load(body);
            expect($('.bin-stock-availability').text()).to.have.string(`Notify Me`);
            done();
        })
    });
    it(`Test in stock local`, function (done) {
        let $ = cheerio.load(fs.readFileSync('test/test_html/barbell_opb_ss.html'));
        expect($('.product-options-bottom button').text()).to.have.string(`Notify Me`);
        done();
    });
});
