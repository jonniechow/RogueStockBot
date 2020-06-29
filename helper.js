var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");

function getDataFromJS(fileLocation) {
  let $ = cheerio.load(fs.readFileSync(fileLocation));
  var obj = $("script[type='text/javascript']");
  let info = [];
  for (var i in obj) {
    for (var j in obj[i].children) {
      var data = obj[i].children[j].data;
      if (data && data.includes("ColorSwatches")) {
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
  info.forEach((element, index) => {
    let first_key = Object.keys(element)[0];
    items[index] = {};
    items[index]["name"] = element[first_key]["label"];
    items[index]["price"] = $(".price").first().text().trim();
    items[index]["in_stock"] = element[first_key]["isInStock"]
      ? "Add to Cart"
      : "Notify Me";
  });
  return items;
}

function getRequestDataFromJS(body, scriptName, sliceAmount=0) {
  let $ = cheerio.load(body);
  var obj = $("script[type='text/javascript']");
  let info = [];
  for (var i in obj) {
    for (var j in obj[i].children) {
      var data = obj[i].children[j].data;
      if (data && data.includes(scriptName)) {
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
  if (sliceAmount != 0) {
    info = info.slice(0, sliceAmount);
  }
  info.forEach((element, index) => {
    let first_key = Object.keys(element)[0];
    items[index] = {};
    items[index]["name"] = element[first_key]["label"];
    items[index]["price"] = $(".price").first().text().trim();
    items[index]["in_stock"] = element[first_key]["isInStock"]
      ? "Add to Cart"
      : "Notify Me";
  });
  return items;
}

module.exports = {
  getDataFromJS,
  getRequestDataFromJS
};
