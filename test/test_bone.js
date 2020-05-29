var expect = require('chai').expect;
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var should = require('should');
var axios = require('axios');
var afterLoad = require('after-load');
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: false });

describe('Bone 29 barbell', function () {
    it(`Test product name`, function (done) {
        let $ = cheerio.load(fs.readFileSync('test/test_html/bone29.html'));
        expect($('.product-title').text()).to.equal(`Rogue 29MM Boneyard Bars`);
        done();
    });
    it(`Test price`, function (done) {
        let $ = cheerio.load(fs.readFileSync('test/test_html/bone29.html'));
        expect($('.price').text()).to.equal(`$195.00`);
        done();
    });
    it(`Test in stock local`, function (done) {
        let $ = cheerio.load(fs.readFileSync('test/test_html/bone29.html'));
        expect($('.bin-stock-availability').text()).to.have.string(`Notify Me`);
        done();
    });
});
describe('Bone 28.5 barbell', function () {
    it(`Test item props`, function (done) {
        let $ = cheerio.load(fs.readFileSync('test/test_html/bone28.5.html'));
        let items = [];
        $('.grouped-item').each(function (index, element) {
            items[index] = {};
            items[index]['name'] = $(element).find('.item-name').text();
            items[index]['price'] = $(element).find('.price').text();
            items[index]['in_stock'] = $(element).find('.bin-stock-availability').text();
          });
        expect(items[0]['name']).to.equal(`Boneyard Rogue Ohio Bar 1.2 with (Black Zinc Shaft / Bright Zinc Sleeve)`);
        expect(items[1]['name']).to.equal(`Boneyard 28.5MM Echo Bar 2.0 with (Black Zinc Shaft / Chrome Sleeve)`);

        expect(items[0]['price']).to.equal(`$225.00`);
        expect(items[1]['price']).to.equal(`$165.00`);

        expect(items[0]['in_stock']).to.have.string(`Out of Stock`);
        expect(items[1]['in_stock']).to.have.string(`Out of Stock`);
        done();
    });
});