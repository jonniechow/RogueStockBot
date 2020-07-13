/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger Platform Quick Start Tutorial
 *
 * This is the completed code for the Messenger Platform quick start tutorial
 *
 * https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start/
 *
 * To run this code, you must do the following:
 *
 * 1. Deploy this code to a server running Node.js
 * 2. Run `npm install`
 * 3. Update the VERIFY_TOKEN
 * 4. Add your PAGE_ACCESS_TOKEN to your environment vars
 *
 */

"use strict";
require("dotenv").config();
const PAGE_ACCESS_TOKEN = process.env.TEST_ACCESS_TOKEN;
// Imports dependencies and set up http server
const request = require("request"),
  express = require("express"),
  axios = require("axios"),
  cheerio = require("cheerio"),
  body_parser = require("body-parser"),
  fs = require("fs"),
  path = require("path"),
  readline = require("readline"),
  stream = require("stream"),
  app = express().use(body_parser.json()),
  search_urls = require("./item-urls"),
  useless_items = require("./useless-items");

const MongoClient = require("mongodb").MongoClient;
const mongo_url = process.env.MONGO_URL;
const client = new MongoClient(mongo_url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

var { getDataFromJS, getRequestDataFromJS } = require("./helper");

// Dictionary of user_id to items they are searching
let user_id_dic = {};
let start_time;
// Delay in seconds
let delay = 10;
// Limit of iteems
let item_limit = 10;
var db;

client.connect((err) => {
  if (err) throw err;
  db = client.db("rogue");
  // Sets server port and logs message on success
  app.listen(process.env.PORT || 1337, () => {
    console.log("webhook is listening");
    try {
      setInterval(handleAllURLs, delay * 1000);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  });
});

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/views/"));

// Home screen page
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/bot-guide", (req, res) => {
  res.render("bot-guide");
});

app.get("/terms", (req, res) => {
  res.render("terms");
});

app.get("/privacy-policy", (req, res) => {
  res.render("privacy-policy");
});

app.get("/current-items", (req, res) => {
  const collection = db.collection("items");
  collection
    .find()
    .toArray()
    .then((items) => {
      console.log(`Successfully found ${items.length} documents.`);
      res.render("current-items", { data: items });
    })
    .catch((err) => console.log(`Failed to find ${err}`));
  // res.render("current-items", { data: search_urls });
});

app.get("/items-in-stock", (req, res) => {
  res.render("items-in-stock", { data: search_urls });
});

app.get("/stock-updates", (req, res) => {
  const collection = db.collection("restock");
  collection
    .find()
    .sort({ restockTime: -1 })
    .limit(100)
    .toArray()
    .then((items) => {
      console.log(`Successfully found ${items.length} documents.`);
      res.render("stock-updates", { data: items });
    })
    .catch((err) => console.log(`Failed to find ${err}`));
});

// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => {
  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === "page") {
    body.entry.forEach(function (entry) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log("---MESSAGE RECEIVED---");
      // console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log("Sender ID: " + sender_psid + "\n");

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });
    // Return a '200 OK' response to all events
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

// Accepts GET requests at the /webhook endpoint
app.get("/webhook", (req, res) => {
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = "VERIFY_TOKEN";

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

async function handleAllURLs() {
  const itemCollection = db.collection("items");
  itemCollection
    .find()
    .toArray()
    .then((items) => {
      items.forEach(async (item) => {
        let data = await getDataFromURL(item);
        let item_str = "";
        let write_item_str = "";
        let in_stock_count = 0;
        let itemShortName = item["short_name"];
        let itemFullName = item["product_name"];
        let itemLink = item["link"];
        let prev_stock_count = item["stockCount"];
        let rand_string = Math.random().toString(36).substring(7);
        const restockCollection = db.collection("restock");

        // Loop through each item on page
        data.forEach((item) => {
          var avail = decodeURI("\u2705");

          // Check if data returned is empty
          if (Object.keys(item).length == 0) {
            return;
          }

          // Out of stock
          if (
            item["in_stock"].indexOf("Notify Me") >= 0 ||
            item["in_stock"].indexOf("Out of Stock") >= 0
          ) {
            // Cross emoji
            avail = decodeURI("\u274C");
          }
          // In stock
          else {
            // Check emoji
            avail = decodeURI("\u2705");
            in_stock_count += 1;
            write_item_str += item["name"] + " " + avail + ", ";
            item_str +=
              item["name"] +
              "\n" +
              item["price"] +
              "\nIn stock: " +
              avail +
              "\n \n";
          }
          // item_str +=
          //   item["name"] + "\n" + item["price"] + "\nIn stock: " + avail + "\n \n";
        });

        // No items found, everything sold out
        if (item_str === "") {
          item_str = "Everything currently out of stock.\n\n";
          write_item_str = "Everything currently out of stock.";
        }

        // Set date
        var today = new Date();
        var date =
          today.getMonth() +
          1 +
          "/" +
          today.getDate() +
          "/" +
          today.getFullYear();
        var time = today.toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        });
        var dateTime = time + " EST " + date;

        // Sends first check message
        Object.keys(item["sender_ids"]).forEach(async (sender) => {
          if (item["sender_ids"][sender] == 0) {
            let key = `sender_ids.${sender}`;
            itemCollection.updateOne(
              { short_name: item["short_name"] },
              { $set: { [key]: 1 } }
            );
            let userItems = await getUserDataFromDB(sender);
            let response = {
              text:
                `FIRST CHECK: "${itemShortName}"\n` +
                `Match found for: "${itemFullName}".\n` +
                `Currently searching ${userItems.length}/${item_limit} items` +
                "\n\n" +
                item_str +
                `First initial check on ${dateTime}\n` +
                `You will be notified everytime there is a change in stock.\n` +
                `Will begin running in the background until "stop"\n\n` +
                `Link:\n${item["link"] + "?=" + rand_string}\n\n` +
                `If this bot has helped you get your items please consider donating!\npaypal.me/roguestockbot`,
            };
            callSendAPI(sender, response);
          }
        });

        // If item was in stock, but is now out of stock
        if (in_stock_count == 0 && prev_stock_count > 0) {
          const restockItem = {
            restockTime: dateTime,
            itemFullName: itemFullName,
            restockString: write_item_str,
            itemLink: itemLink,
          };

          restockCollection
            .insertOne(restockItem)
            .then((result) => {
              console.log(`Successfully inserted item: ${itemShortName}`);
            })
            .catch((err) => console.error(`Failed to insert item: ${err}`));
        }
        // Difference in stock count
        else if (in_stock_count != prev_stock_count) {
          console.log(`Response msg: Update in stock ${itemShortName}`);
          // Send response to every user
          Object.keys(item["sender_ids"]).forEach(async (sender_id) => {
            let userItems = await getUserDataFromDB(sender_id);
            let response = {
              text:
                `RESTOCK: "${itemShortName}"\n` +
                `Match found for: "${itemFullName}".\n` +
                `Currently searching ${userItems.length}/${item_limit} items` +
                "\n\n" +
                item_str +
                `Checked On ${dateTime}\n` +
                `Original link:\n${itemLink}\n\n` +
                `Non-cached link:\n${itemLink + "?=" + rand_string}\n\n` +
                `If this bot has helped you get your items please consider donating!\npaypal.me/roguestockbot`,
            };
            callSendAPI(sender_id, response);
          });
          const restockItem = {
            restockTime: dateTime,
            itemFullName: itemFullName,
            restockString: write_item_str,
            itemLink: itemLink,
          };
          restockCollection
            .insertOne(restockItem)
            .then((result) => {
              console.log(`Successfully inserted item: ${itemShortName}`);
            })
            .catch((err) => console.error(`Failed to insert item: ${err}`));
        }
        // Update prev stock to current stock
        itemCollection.updateOne(
          { short_name: itemShortName },
          { $set: { stockCount: in_stock_count } }
        );
      });
    })
    .catch((err) => console.error(`Failed to find documents: ${err}`));
}

// Parses HTML from URL and returns data structure containing relevent data
async function getDataFromURL(item) {
  var item_link = item["link"];
  try {
    let response = await axios.get(item_link);
    let redirect_count = response.request._redirectable._redirectCount;
    var item_type = item["type"];

    // console.log("Looking for: " + item["product_name"]);
    // console.log(redirect_count);
    // console.log("Web scraping data from: " + item_link);
    let $ = cheerio.load(response.data);
    var items = [];

    // Multiple items in a page
    if (item_type === "multi") {
      $(".grouped-item").each(function (index, element) {
        let item_name = $(element).find(".item-name").text();
        items[index] = {};
        // Check for useless items
        if (useless_items.indexOf(item_name) >= 0) {
          return;
        }
        items[index]["name"] = $(element).find(".item-name").text();
        items[index]["price"] = $(element).find(".price").text();
        items[index]["in_stock"] = $(element)
          .find(".bin-stock-availability")
          .text();
      });
    } else if (item_type === "bone") {
      // Boneyard page exists
      if (redirect_count == 0) {
        $(".grouped-item").each(function (index, element) {
          items[index] = {};
          items[index]["name"] = $(element).find(".item-name").text();
          items[index]["price"] = $(element).find(".price").text();
          items[index]["in_stock"] = $(element)
            .find(".bin-stock-availability")
            .text();
        });
      } else {
        items[0] = {};
        items[0]["in_stock"] = "Notify Me";
      }
    } else if (item_type === "grab bag") {
      // Boneyard page exists
      if (redirect_count == 0) {
        items[0] = {};
        items[0]["in_stock"] = "Add to cart";
      } else {
        items[0] = {};
        items[0]["in_stock"] = "Notify Me";
      }
    } else if (item_type === "cerakote") {
      items = getRequestDataFromJS(response.data, "relatedColorSwatches");
    } else if (item_type === "monster bench") {
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
      info = info.slice(0, 2);
      info.forEach((element, index) => {
        Object.keys(element).forEach((mini_item, index2) => {
          items[index * 3 + index2] = {};
          items[index * 3 + index2]["name"] =
            element[mini_item]["product_name"];
          items[index * 3 + index2]["in_stock"] = element[mini_item][
            "isInStock"
          ]
            ? "Add to Cart"
            : "Notify Me";
          items[index * 3 + index2]["price"] = $(".price").first().text();
        });
      });
    } else if (item_type === "rmlc") {
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
      info = info.slice(0, 11);
      info.forEach((element, index) => {
        Object.keys(element).forEach((mini_item, index2) => {
          let label = element[mini_item]["label"];
          let name_label = label.substring(0, label.indexOf("("));
          let dic = {
            name:
              index2 == 0 ? name_label + "Standard" : name_label + "Numbered",
            in_stock: element[mini_item]["isInStock"]
              ? "Add to Cart"
              : "Notify Me",
            price: $(".price").first().text(),
          };
          items.push(dic);
        });
      });
    } else if (item_type === "db15") {
      items = getRequestDataFromJS(response.data, "RogueColorSwatches", 2);
    } else if (item_type === "custom") {
      items = getRequestDataFromJS(response.data, "ColorSwatches");
    }
    // Just one item in a page
    else {
      items[0] = {};
      items[0]["name"] = $(".product-title").text();
      items[0]["price"] = $(".price").text();
      items[0]["in_stock"] = $(".product-options-bottom button").text();
    }
    return items;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}

function getTimeDiff(start_time) {
  var curr_time = new Date();
  var time_elapsed = (curr_time - start_time) / 1000;

  var seconds = Math.round(time_elapsed % 60);
  // remove seconds from the date
  time_elapsed = Math.floor(time_elapsed / 60);

  // get minutes
  var minutes = Math.round(time_elapsed % 60);

  // remove minutes from the date
  time_elapsed = Math.floor(time_elapsed / 60);

  // get hours
  var hours = Math.round(time_elapsed % 24);

  // remove hours from the date
  time_elapsed = Math.floor(time_elapsed / 24);
  var time_elapsed_str = `${time_elapsed} days ${hours}:${minutes}:${seconds}`;
  return time_elapsed_str;
}

function getUserDataFromDB(sender_psid) {
  const searchesCollection = db.collection("searches");
  return searchesCollection
    .find({ userID: sender_psid })
    .toArray()
    .then((items) => {
      console.log(`Successfully found ${items.length} documents.`);
      return items;
    })
    .catch((err) => console.error(`Failed to find documents: ${err}`));
}

// Handles messages from sender
async function handleMessage(sender_psid, received_message) {
  let response;

  // Checks if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    var rec_msg = received_message.text.toLowerCase();
    const searchesCollection = db.collection("searches");
    const itemCollection = db.collection("items");
    let itemFullName = rec_msg;

    // Checks if user is in dict, if not creates entry
    if (!(sender_psid in user_id_dic)) {
      user_id_dic[sender_psid] = {
        products: {},
        "start-date": {},
        intervals: [],
      };
    }

    // Set start time
    if (Object.keys(user_id_dic).length == 1) {
      start_time = new Date();
      var date =
        start_time.getMonth() +
        1 +
        "/" +
        start_time.getDate() +
        "/" +
        start_time.getFullYear();
      var time = start_time.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });
      start_time = time + " EST " + date;
    }

    // Help message
    if (rec_msg === "help") {
      var keys = Object.keys(search_urls);
      var key_string = "";
      for (var i = 0; i < keys.length; ++i) {
        key_string += keys[i] + "\n";
      }
      response = {
        text:
          `HELP MSG:\n` +
          `How to guide for the bot:\nroguestockbot.com/bot-guide\n\n` +
          `All current items supported:\nroguestockbot.com/current-items\n\n` +
          `1) Look up the commands for what item you want to search for on\n` +
          `roguestockbot.com/current-items\n` +
          `2) Reply back to this bot with each command one by one\n` +
          `3) The bot will reply back with an initial check then message you whenever there's an update\n\n` +
          `Type 'status' to check what items you are searching\n` +
          `Type 'stop' to stop checking all items\n`,
      };
      callSendAPI(sender_psid, response);
      return;
    }
    // Status message
    else if (rec_msg === "status") {
      let userItems = await getUserDataFromDB(sender_psid);
      let numPeopleSearching = await searchesCollection.distinct("userID");

      let statusString =
        `STATUS ${userItems.length}/${item_limit} items\:\n` +
        `There are ${numPeopleSearching.length} total users searching\n\n`;
      // Loop through each item user is searching
      for (var item in userItems) {
        let currItem = userItems[item];
        let numPeopleSearchItem = await itemCollection
          .find({ short_name: currItem["itemName"] })
          .toArray()
          .then((item) => {
            return Object.keys(item[0]["sender_ids"]).length;
          });
        statusString +=
          `${currItem["itemFullName"]} / ${currItem["itemName"]}\n` +
          `People searching: ${numPeopleSearchItem} \n` +
          `Time elapsed: ${getTimeDiff(currItem["startTime"])}\n\n`;
      }

      statusString +=
        `Last reset: ${start_time}\n\n` +
        `If this bot has helped you get your items please consider donating!\npaypal.me/roguestockbot`;
      response = {
        text: statusString,
      };
      callSendAPI(sender_psid, response);
      return;
    }
    // Stop message
    else if (rec_msg === "stop") {
      let userItems = await getUserDataFromDB(sender_psid);
      let itemString =
        `STOP MSG:\n` + `Stopped checking ${userItems.length} item(s):\n\n`;
      let deleteString = await searchesCollection
        .deleteMany({ userID: sender_psid })
        .then((items) => {
          console.log(`Deleted ${items.deletedCount} item(s).`);
          userItems.forEach((item) => {
            itemString +=
              `${item["itemFullName"]} / ${item["itemName"]}\n` +
              `People searching: 0 \n` +
              `Time elapsed: ${getTimeDiff(item["startTime"])}\n\n`;
          });
          itemString +=
            `Last reset: ${start_time}\n\n` +
            `If this bot has helped you get your items please consider donating!\npaypal.me/roguestockbot`;
          return itemString;
        })
        .catch((err) => console.log(`${err}`));

      response = {
        text: deleteString,
      };

      callSendAPI(sender_psid, response);
      return;
    }
    // Stop single item
    else if (rec_msg.split(" ")[0] === "stop") {
      let stopItemMessage = rec_msg.split(" ");
      try {
        if (stopItemMessage.length > 1) {
          let itemToDelete = stopItemMessage.slice(1).join(" ");

          let itemString = `STOP MSG:\n` + `Stopped checking 1 item:\n\n`;
          let deleteString = await searchesCollection
            .deleteOne({ userID: sender_psid, itemName: itemToDelete })
            .then((items) => {
              console.log(`Deleted ${rec_msg}`);
              itemString += `${itemToDelete}\n`;
              return itemString;
            })
            .catch((err) => console.log(`${err}`));

          response = {
            text: deleteString,
          };

          callSendAPI(sender_psid, response);
          return;
        } else {
          throw "Invalid stop message";
        }
      } catch (err) {
        response = {
          text: `INVALID:\n` + `ERROR: ${err}`,
        };
        callSendAPI(sender_psid, response);
        return;
      }
    }

    // Check if item is valid
    let errResponseValid = await itemCollection
      .find({ short_name: rec_msg })
      .toArray()
      .then((items) => {
        console.log(`Successfully found ${items.length} documents.`);
        if (items.length == 0) {
          response = {
            text:
              `INVALID\nYou entered: "${received_message.text}".\n` +
              `Item doesn't exist\n\n` +
              `Go to roguestockbot.com/current-items for all supported items`,
          };
          callSendAPI(sender_psid, response);
          return;
        } else {
          itemFullName = items[0]["product_name"];
        }
      })
      .catch((err) => console.error(`Failed to find documents: ${err}`));

    if (errResponseValid) {
      callSendAPI(sender_psid, errResponseValid);
      return;
    }

    // Check for duplicate searches
    let errResponseDup = await searchesCollection
      .find({ userID: sender_psid, itemName: rec_msg })
      .toArray()
      .then((items) => {
        console.log(`Successfully found ${items.length} documents.`);
        if (items.length > 0) {
          response = {
            text: `INVALID\nAlready searching: "${search_urls[rec_msg]["product_name"]}".\n`,
          };
          return response;
        }
      })
      .catch((err) => console.error(`Failed to find documents: ${err}`));

    if (errResponseDup) {
      callSendAPI(sender_psid, errResponseDup);
      return;
    }

    // Insert current search into database
    const userSearchItem = {
      userID: sender_psid,
      itemName: rec_msg,
      itemFullName: itemFullName,
      startTime: new Date(),
      count: 0,
    };
    searchesCollection
      .insertOne(userSearchItem)
      .then((result) => {
        console.log(
          `Successfully inserted item: ${rec_msg} to user:${sender_psid}`
        );
        let key = `sender_ids.${sender_psid}`;
        itemCollection.updateOne(
          { short_name: rec_msg },
          { $set: { [key]: 0 } }
        );
      })
      .catch((err) => console.error(`Failed to insert item: ${err}`));
  }

  // Send the response message
  callSendAPI(sender_psid, response);
}

function handlePostback(sender_psid, received_postback) {
  console.log("ok");
  let response;
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === "yes") {
    response = {
      text: "Thanks!",
    };
  } else if (payload === "no") {
    response = {
      text: "Oops, try sending another image.",
    };
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
    tag: "CONFIRMED_EVENT_UPDATE",
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v2.6/me/messages",
      qs: {
        access_token: PAGE_ACCESS_TOKEN,
      },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("---MESSAGE SENT!---\n");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
}
