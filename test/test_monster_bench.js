var expect = require("chai").expect;
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");

describe("Monster Utility Bench", function () {
  it(`Test opb cerakote avail`, function (done) {
    this.timeout(5000);
    var options = {
      url: "https://www.roguefitness.com/monster-utility-bench-2-0-mg-black",
      timeout: 3000,
    };
    request(options, function (err, response, body) {
      let $ = cheerio.load(body);
      var obj = $("script[type='text/javascript']");
      let info = [];
      loop1: for (var i in obj) {
        for (var j in obj[i].children) {
          var data = obj[i].children[j].data;
          if (data && data.includes("RogueColorSwatches")) {
            data = data.substring(
              data.indexOf("RogueColorSwatches"),
              data.length
        );
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
            break loop1;
          }
        }
      }
      let items = [];
      info = info.slice(0, 2);
      info.forEach((element, index) => {
        Object.keys(element).forEach((mini_item, index2) => {
          items[index * 3 + index2] = {};
          items[index * 3 + index2]["name"] =
            element[mini_item]["product_name"];
          items[index * 3 + index2]["in_stock"] =
            element[mini_item]["isInStock"];
            items[index * 3 + index2]["price"] =
            $(".price").first().text();
        });
      });
      expect($(".bin-stock-availability").text()).to.have.string(`Notify Me`);
      expect(items.should.have.length(6));
      done();
    });
  });
});
