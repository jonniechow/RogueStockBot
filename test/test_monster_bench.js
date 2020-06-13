var expect = require("chai").expect;
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");

describe("Monster Utility Bench", function() {
    it(`Test opb cerakote avail`, function (done) {
        var options = {
          url:
            "https://www.roguefitness.com/monster-utility-bench-2-0-mg-black",
          timeout: 3000,
        };
        request(options, function (err, response, body) {
          let $ = cheerio.load(body);
          var obj = $("script[type='text/javascript']");
          let info = [];
          for (var i in obj) {
            for (var j in obj[i].children) {
              var data = obj[i].children[j].data;
              if (data && data.includes("RogueColorSwatches")) {
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
          console.log(info);
          expect($(".bin-stock-availability").text()).to.have.string(`Notify Me`);
          //expect(info.should.have.length(4));
          done();
        });
      });
})
