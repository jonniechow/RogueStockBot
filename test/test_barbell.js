var expect = require("chai").expect;
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
var should = require("should");
var axios = require("axios");
var afterLoad = require("after-load");
var Nightmare = require("nightmare");
var nightmare = Nightmare({
  show: false,
});

describe("Barbell", function () {
  it(`Test rogue 2.0 avail`, function (done) {
    this.timeout(3000);
    request.get("https://www.roguefitness.com/the-rogue-bar-2-0", function (
      err,
      response,
      body
    ) {
      let $ = cheerio.load(body);
      expect($(".bin-stock-availability").text()).to.have.string(`Notify Me`);
      done();
    });
  });
});

describe("Cerakote", function () {
  it(`Test opb cerakote avail`, function (done) {
    var options = {
      url:
        "https://www.roguefitness.com/rogue-45lb-ohio-powerlift-bar-cerakote",
      timeout: 3000,
    };
    request(options, function (err, response, body) {
      let $ = cheerio.load(body);
      var obj = $("script[type='text/javascript']");
      let info = [];
      for (var i in obj) {
        for (var j in obj[i].children) {
          var data = obj[i].children[j].data;
          if (data && data.includes("relatedColorSwatches")) {
            var split_data = data.split(/[[\]]{1,2}/);
            split_data.forEach((item) => {
              if (item.includes("additional_options")) {
                var stripped_str = item.substring(
                  item.indexOf("{"),
                  item.lastIndexOf("realLabel") - 2
                );
                info.push(JSON.parse(stripped_str));
              }
            });
          }
        }
      }
      expect($(".bin-stock-availability").text()).to.have.string(`Notify Me`);
      expect(info.should.have.length(4));
      done();
    });
  });
  it(`Test op cerakote avail`, function (done) {
    var options = {
      url: "https://www.roguefitness.com/the-ohio-bar-cerakote",
      timeout: 3000,
    };
    request(options, function (err, response, body) {
      let $ = cheerio.load(body);
      var obj = $("script[type='text/javascript']");
      let info = [];
      for (var i in obj) {
        for (var j in obj[i].children) {
          var data = obj[i].children[j].data;
          if (data && data.includes("relatedColorSwatches")) {
            var split_data = data.split(/[[\]]{1,2}/);
            split_data.forEach((item) => {
              if (item.includes("additional_options")) {
                var stripped_str = item.substring(
                  item.indexOf("{"),
                  item.lastIndexOf("realLabel") - 2
                );
                info.push(JSON.parse(stripped_str));
              }
            });
          }
        }
      }
      expect($(".bin-stock-availability").text()).to.have.string(`Notify Me`);
      expect(info.should.have.length(14));
      done();
    });
  });
  it(`Test dl cerakote avail`, function (done) {
    var options = {
      url: "https://www.roguefitness.com/rogue-ohio-deadlift-cerakote",
      timeout: 3000,
    };
    request(options, function (err, response, body) {
      let $ = cheerio.load(body);
      var obj = $("script[type='text/javascript']");
      let info = [];
      for (var i in obj) {
        for (var j in obj[i].children) {
          var data = obj[i].children[j].data;
          if (data && data.includes("relatedColorSwatches")) {
            var split_data = data.split(/[[\]]{1,2}/);
            split_data.forEach((item) => {
              if (item.includes("additional_options")) {
                var stripped_str = item.substring(
                  item.indexOf("{"),
                  item.lastIndexOf("realLabel") - 2
                );
                info.push(JSON.parse(stripped_str));
              }
            });
          }
        }
      }
      expect($(".bin-stock-availability").text()).to.have.string(`Notify Me`);
      expect(info.should.have.length(3));
      done();
    });
  });
});

describe("Stainless Steel", function () {
  it(`Test opb ss avail`, function (done) {
    this.timeout(3000);
    var options = {
      url: "https://www.roguefitness.com/rogue-45lb-ohio-power-bar-stainless",
      timeout: 3000,
    };
    request(options, function (err, response, body) {
      let $ = cheerio.load(body);
      expect($(".bin-stock-availability").text()).to.have.string(`Notify Me`);
      done();
    });
  });
  it(`Test op ss avail`, function (done) {
    this.timeout(3000);
    var options = {
      url: "https://www.roguefitness.com/rogue-45lb-ohio-power-bar-stainless",
      timeout: 3000,
    };
    request(options, function (err, response, body) {
      let $ = cheerio.load(body);
      expect($(".bin-stock-availability").text()).to.have.string(`Notify Me`);
      done();
    });
  });
  it(`Test in stock local`, function (done) {
    let $ = cheerio.load(fs.readFileSync("test/test_html/barbell_opb_ss.html"));
    expect($(".product-options-bottom button").text()).to.have.string(
      `Notify Me`
    );
    done();
  });
  it(`Test product name`, function (done) {
    this.timeout(5000);
    request.get(
      "https://www.roguefitness.com/rogue-45lb-ohio-power-bar-stainless",
      function (err, response, body) {
        response.statusCode.should.equal(200);
        let $ = cheerio.load(body);
        expect($(".product-title").text()).to.equal(
          `Rogue 45LB Ohio Power Bar - Stainless Steel`
        );
        expect($(".bin-stock-availability").text()).to.have.string(`Notify Me`);
        done();
      }
    );
  });
  it(`Test price`, function (done) {
    request.get(
      "https://www.roguefitness.com/rogue-45lb-ohio-power-bar-stainless",
      function (err, response, body) {
        let $ = cheerio.load(body);
        expect($(".price").text()).to.equal(`$395.00`);
        done();
      }
    );
  });
});
