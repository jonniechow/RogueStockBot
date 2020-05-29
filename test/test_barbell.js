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
    it(`Test in stock local`, function (done) {
        let $ = cheerio.load(fs.readFileSync('test/test_html/barbell_opb_ss.html'));
        expect($('.product-options-bottom button').text()).to.have.string(`Notify Me`);
        done();
    });
    // it(`Test in stock request`, function (done) {
    //     nightmare
    //         .goto('https://www.roguefitness.com/rogue-45lb-ohio-power-bar-stainless')
    //         .wait(15000)
    //         .evaluate(function () {
    //             return document.body.innerHTML;
    //         })
    //         .then(function (body) {
    //             var $ = cheerio.load(body);
    //             expect($('.product-options-bottom button').text()).to.have.string(`Notify Me`);

    //         })
    //         done();
    // });
    // it(`Test in stock`, function (done) {
    //     afterLoad('https://www.roguefitness.com/rogue-45lb-ohio-power-bar-stainless', function (html) {
    //         let $ = cheerio.load(html);
    //         expect($('.product-options-bottom button').text()).to.have.string(`Notify Me`);
    //         done();
    //     });
    // }).timeout(20000);
});