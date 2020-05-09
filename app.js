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

'use strict';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
// Imports dependencies and set up http server
const request = require('request'),
  express = require('express'),
  axios = require('axios'),
  cheerio = require('cheerio'),
  body_parser = require('body-parser'),
  path = require('path'),
  app = express().use(body_parser.json()),
  search_urls = require('./item-urls')
// creates express http server

var interval_id = null;
var search_dic = {};
var user_id_dic = {};
var start_time = new Date();
// Delay in seconds
var delay = 10;
// Limit of iteems
var item_limit = 4;


app.use(express.static(__dirname + '/views/'));

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Home screen page
app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: path.join(__dirname, '/views')
  })
});

app.get('/bot-guide', (req, res) => {
  res.sendFile('bot-guide.html', {
    root: path.join(__dirname, '/views')
  })
});

app.get('/terms', (req, res) => {
  res.sendFile('terms.html', {
    root: path.join(__dirname, '/views')
  })
});

app.get('/privacy-policy', (req, res) => {
  res.sendFile('privacy-policy.html', {
    root: path.join(__dirname, '/views')
  })
});

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => { // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    body.entry.forEach(function (entry) { // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender ID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      }
      else if (webhook_event.postback) {

        handlePostback(sender_psid, webhook_event.postback);
      }

    });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  }
  else { // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => { /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = "VERIFY_TOKEN";

  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Check if a token and mode were sent
  if (mode && token) { // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) { // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    }
    else { // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

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
  var time_elapsed_str = hours + ":" + minutes + ":" + seconds;
  return time_elapsed_str;
}

// Parses HTML from URL and returns data structure containing relevent data
function getDataFromURL(item, callback) {
  var item_url_dict = search_urls[item];
  var item_link = item_url_dict['link'];
  request(
    {
      method: 'GET',
      url: item_link
    },
    function (error, response, html) {
      if (error) {
        return callback(error)
      };
      if (!error && response.statusCode == 200) {
        var item_type = item_url_dict['type'];

        console.log(item);
        console.log("Web scraping data from: " + item_link);
        let $ = cheerio.load(html);
        var items = [];
        // Check if search string already exists
        if (!(item in search_dic)) {
          search_dic[item] = {};
          search_dic[item]['product-name'] = $('.product-title').text();
          search_dic[item]['user_ids'] = [];
        }

        // Multiple items in a page
        if (item_type === "multi") {
          $('.grouped-item').each(function (index, element) {
            items[index] = {};
            items[index]['name'] = $(element).find('.item-name').text();
            items[index]['price'] = $(element).find('.price').text();
            items[index]['in_stock'] = $(element).find('.bin-stock-availability').text();
          });
        }
        // Just one item in a page
        else {
          items[0] = {};
          items[0]['name'] = $('.product-title').text();
          items[0]['price'] = $('.price').text();
          items[0]['in_stock'] = $('.bin-stock-availability').text();
        }

        return callback(items);
      }
    }
  );
}

// Checks each URL that has people searching
function handleAllURLS(received_message, callback) {
  // Loop through each item
  for(let item in search_urls) {
    // Checks if there is at least 1 person searching for the item
    if(Object.keys(search_urls[item]['sender_ids']).length > 0) {
      // Parse the HTML
      getDataFromURL(item, function(data) {
        let item_str = "";
        let in_stock_count = 0;
        
        // Loop through each item on page
        for (let i = 0; i < data.length; i++) {
          var avail = decodeURI('\u2705');
          // Out of stock
          if (data[i]['in_stock'].indexOf("Notify Me") > 0) { // Cross emoji
            avail = decodeURI('\u274C');
          }
          // In stock
          else { // Check emoji
            avail = decodeURI('\u2705');
            in_stock_count += 1;
            item_str += data[i]['name'] + "\n" + data[i]['price'] + "\nIn stock: " + avail + "\n \n"
          }
          //item_str += data[i]['name'] + "\n" + data[i]['price'] + "\nIn stock: " + avail + "\n \n"
        }

        // No items found, everything sold out
        if (item_str === "") {
          item_str = "Everything currently out of stock.\n\n";
        }

        // Set date
        var today = new Date();
        var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
        var time = today.toLocaleString('en-US',
          {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
          });
        var dateTime = time + ' ' + date;

        // console.log(search_dic);
        // console.log(user_id_dic);
        console.log(search_urls[item]);

        // Difference in stock count
        if (!('prev_stock_count' in search_urls[item]) || (in_stock_count != search_urls[item]['prev_stock_count'])) {
          console.log("Response msg: Update in stock");
          // Send response to every user
          for (let sender_id in search_urls[item]['sender_ids']) {
            // Response message
            var response = {
              "text": `You entered: "${received_message.text}"\n` +
                `Match found for: "${search_dic[item]['product-name']}".\n` +
                `Currently searching ${Object.keys(user_id_dic[sender_id]['products']).length}/${item_limit} items` +
                "\n\n" + item_str +
                "Checked On " + dateTime + "\n" +
                "Link " + search_urls[item]['link']
            };
            callSendAPI(sender_id, response);
          }
        }
        // Update prev stock to current stock
        search_urls[item]['prev_stock_count'] = in_stock_count;
      });
    }
  }
  callback();
}

function handleMessage(sender_psid, received_message) {
  let response;

  // Checks if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    var rec_msg = received_message.text.toLowerCase();

    // Checks if user is in dict, if not creates entry
    if (!(sender_psid in user_id_dic)) {
      user_id_dic[sender_psid] = {'products': {}, 'start-date': {}, 'intervals': []};
    }

    // Help message
    if (rec_msg === "help") {
      var keys = Object.keys(search_urls);
      var key_string = "";
      for (var i = 0; i < keys.length; ++i) {
        key_string += keys[i] + "\n";
      }
      response = {
        "text": "Search for the following items: \n" + key_string +
          "Type `stop` to stop checking all items \n" +
          "Please type commands ONLY after bot replies to first command or it may crash"
      };
      callSendAPI(sender_psid, response);
      return;
    }
    // Status message
    else if (rec_msg === "status") {
      console.log(user_id_dic);
      var search_str = `Currently searching ${Object.keys(user_id_dic[sender_psid]['products']).length}/${item_limit} items
      \n\n`;
      for (var key in user_id_dic[sender_psid]['products']) {
        search_str += search_dic[key]['product-name'] + " / " + key +
        "\nTime elapsed: " + getTimeDiff(user_id_dic[sender_psid]['products'][key]) + "\n\n";
      }
      response = {
        "text": search_str

      };

      console.log("USER DIC")
      console.log(user_id_dic);
      
      callSendAPI(sender_psid, response);
      return;
    }
    // Stop message
    else if (rec_msg === "stop") {
      user_id_dic[sender_psid]['intervals'].forEach(clearInterval);
      var search_item_str = "";
      for (var key in user_id_dic[sender_psid]['products']) {
        search_item_str += search_dic[key]['product-name'] +
          "\nTime elapsed: " + getTimeDiff(user_id_dic[sender_psid]['products'][key]) + "\n\n";
      }
      response = {
        "text": `Stopped checking ${user_id_dic[sender_psid]['intervals'].length} item(s):\n\n` +
          search_item_str
      };
      user_id_dic[sender_psid]['intervals'] = [];
      user_id_dic[sender_psid]['products'] = {};
      delete user_id_dic[sender_psid];

      callSendAPI(sender_psid, response);
      return;
    }
    
    // User message is invalid
    if (!(rec_msg in search_urls)) {
      response = {
        "text": `You entered: "${
          received_message.text
          }".` + "\n\n" + 
          "Item doesn't exist\nTry typing `help` for a list of all valid commands"
      };
      //console.log(response);
      callSendAPI(sender_psid, response);
      return;
    }

    // Check if sender_psid is in dic for url
    if (!(sender_psid in search_urls[rec_msg]['sender_ids'])) {
      search_urls[rec_msg]['sender_ids'][sender_psid] = 1;
    } 

    // Check current amount of items
    if (Object.keys(user_id_dic[sender_psid]['products']).length >= item_limit) {
      response = {
        "text": `You have reached max limit of "${item_limit}" items\n`
      };
      callSendAPI(sender_psid, response);
      return;
    }

    // Check if item is already being searched for user
    if (rec_msg in user_id_dic[sender_psid]['products']) {
      response = {
        "text": `Already searching: "${
          search_dic[rec_msg]['product-name']
          }".\n`
      };
      callSendAPI(sender_psid, response);
      return;
    }
    else {
      user_id_dic[sender_psid]['products'][rec_msg] = new Date();
      //user_id_dic[sender_psid]['start-time'] = new Date();
    }

    // Interval to check all URLs
    interval_id = setInterval(function () {
      handleAllURLS(received_message, function() {
        console.log(search_urls);
      });
    }, delay * 1000);

    // Add to list of all interval ids based on sender_psid
    user_id_dic[sender_psid]['intervals'].push(interval_id);
  }
  else if (received_message.attachments) { // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [
            {
              "title": "Is this the right picture?",
              "subtitle": "Tap a button to answer.",
              "image_url": attachment_url,
              "buttons": [
                {
                  "type": "postback",
                  "title": "Yes!",
                  "payload": "yes"
                },
                {
                  "type": "postback",
                  "title": "No!",
                  "payload": "no"
                }
              ]
            }
          ]
        }
      }
    }
  }

  // Send the response message
  callSendAPI(sender_psid, response);
}

function handlePostback(sender_psid, received_postback) {
  console.log('ok')
  let response;
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = {
      "text": "Thanks!"
    }
  }
  else if (payload === 'no') {
    response = {
      "text": "Oops, try sending another image."
    }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) { // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request(
    {
      "uri": "https://graph.facebook.com/v2.6/me/messages",
      "qs": {
        "access_token": PAGE_ACCESS_TOKEN
      },
      "method": "POST",
      "json": request_body
    },
    (err, res, body) => {
      if (!err) {
        console.log('message sent!')
      }
      else {
        console.error("Unable to send message:" + err);
      }
    }
  );
}
