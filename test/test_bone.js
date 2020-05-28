var expect = require('chai').expect;
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var should = require('should');
var axios = require('axios');
var afterLoad = require('after-load');
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true });

describe('Barbell', function () {
    it(`Test product name`, function (done) {
        let $ = cheerio.load(fs.readFileSync('test/test_html/bone29.html'));
        expect($('.product-title').text()).to.equal(`Boneyard Rogue 45LB Ohio Power Bar - Bare Steel with (Raw Shaft / Raw Sleeve)`);
        done();
    });
    it(`Test price`, function (done) {
        let $ = cheerio.load(fs.readFileSync('test/test_html/bone29.html'));
        expect($('.price').text()).to.equal(`$195.00`);
        done();
    });
    it(`Test in stock local`, function (done) {
        let $ = cheerio.load(fs.readFileSync('test/test_html/bone29.html'));
        expect($('.product-options-bottom button').text()).to.have.string(`Notify Me`);
        done();
    });
});