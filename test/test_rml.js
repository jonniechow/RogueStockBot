var expect = require("chai").expect;
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");

describe("RML 490c", function () {
  it(`Test RML avail`, function (done) {
    this.timeout(5000);
    var options = {
      url: "https://www.roguefitness.com/rogue-rml-490-power-rack-color-3-0",
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
          }
        }
      }

      let items = [];
      info = info.slice(0, 11);
      info.forEach((element, index) => {
        Object.keys(element).forEach((mini_item, index2) => {
          let label = element[mini_item]["label"];
          let name_label = label.substring(0, label.indexOf("("));
          let dic = {
            name:
              index2 == 0 ? name_label + "Standard" : name_label + "Numbered",
            in_stock: element[mini_item]["isInStock"],
            price: $(".price").first().text(),
          };
          items.push(dic);
        });
      });

      expect($(".bin-stock-availability").text()).to.have.string(`Notify Me`);
      expect(items.should.have.length(22));
      done();
    });
  });
});
