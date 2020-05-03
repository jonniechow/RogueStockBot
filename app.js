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
  path  = require('path'),
  app = express().use(body_parser.json());
// creates express http server

var interval_id = null;
var interval_id_list = [];
var search_dic = {};
var start_time = new Date();
// Delay in seconds
var delay = 10;
// Limit of iteems
var item_limit = 4;

// Item url dictionary
var search_urls = { // Plate URLs
  "plate hi-temp": "https://www.roguefitness.com/rogue-hi-temp-bumper-plates",
  "plate hg2": "https://www.roguefitness.com/rogue-hg-2-0-bumper-plates",
  "plate comp lb": "https://www.roguefitness.com/rogue-competition-plates",
  "plate comp lb2": "https://www.roguefitness.com/rogue-color-lb-training-2-0-plates",
  "plate black lb": "https://www.roguefitness.com/rogue-black-training-lb-color-stripe-plates",
  "plate black lb2": "https://www.roguefitness.com/rogue-lb-training-2-0-plates",
  "plate echo": "https://www.roguefitness.com/rogue-echo-bumper-plates-with-white-text",
  "plate echo color": "https://www.roguefitness.com/rogue-color-echo-bumper-plate",
  "plate machined": "https://www.roguefitness.com/rogue-machined-olympic-plates",
  "plate fleck": "https://www.roguefitness.com/rogue-fleck-plates",
  "plate olympic": "https://www.roguefitness.com/rogue-olympic-plates",
  "plate cal": "https://www.roguefitness.com/rogue-calibrated-lb-steel-plates",
  "plate change": "https://www.roguefitness.com/rogue-lb-change-plates",
  // Barbell URLs
  // Ohio Bar
  "barbell op oxide": "https://www.roguefitness.com/rogue-ohio-bar-black-oxide",
  "barbell op zinc": "https://www.roguefitness.com/the-ohio-bar-black-zinc",
  "barbell op ecoat": "https://www.roguefitness.com/the-ohio-bar-2-0-e-coat",
  "barbell op ss": "https://www.roguefitness.com/stainless-steel-ohio-bar",
  "barbell op cerakote": "https://www.roguefitness.com/the-ohio-bar-cerakote",
  // Ohio Power Bar
  "barbell opb steel": "https://www.roguefitness.com/rogue-45lb-ohio-power-bar-bare-steel",
  "barbell opb ecoat": "https://www.roguefitness.com/rogue-ohio-power-bar-e-coat",
  "barbell opb zinc": "https://www.roguefitness.com/rogue-45lb-ohio-power-bar-black-zinc",
  "barbell opb ss": "https://www.roguefitness.com/rogue-45lb-ohio-power-bar-stainless",
  "barbell opb cerakote": "https://www.roguefitness.com/rogue-45lb-ohio-powerlift-bar-cerakote",
  // Echo bike
  "bike echo": "https://www.roguefitness.com/rogue-echo-bike",
  // Boneyard
  "bone 29": "https://www.roguefitness.com/rogue-29mm-boneyard-bars",
  "bone 28.5": "https://www.roguefitness.com/rogue-28-5-mm-boneyard-bars",
  "bone dead": "https://www.roguefitness.com/rogue-boneyard-ohio-deadlift-bar"
};

app.use(express.static(__dirname + '/views/'));

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Home screen page
app.get('/', (req, res) => {
  res.sendFile('index.html', {
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

function getData(search_url, rec_msg, callback) {
  request(
    {
      method: 'GET',
      url: search_url
    },
    function (error, response, html) {
      if (error) {
        return callback(error)
      };
      if (!error && response.statusCode == 200) {
        // console.log("Web scraping data from: " + search_url);
        let $ = cheerio.load(html);
        var items = [];
        // Check if search string already exists
        if (!(rec_msg in search_dic)) {
          search_dic[rec_msg] = {};
          search_dic[rec_msg]['product-name'] = $('.product-title').text();
          search_dic[rec_msg]['time-start'] = new Date();
        }


        if (rec_msg.indexOf("cerakote") >= 0) {
          console.log($(".grouped-item").html())
          $(".grouped-item").find('.swatch-item').each(function (index, element) {
            console.log(index);
            items[index] = {};
            items[index]['name'] = $(element).find('span').text();
            items[index]['price'] = $('.special-price .price').text();
            items[index]['in_stock'] = $(element).attr('title');
          });
          console.log(items);
        }
        else if (rec_msg.indexOf("plate") == 0 || rec_msg.indexOf("bike") == 0 ) {
          $('.grouped-item').each(function (index, element) {
            items[index] = {};
            items[index]['name'] = $(element).find('.item-name').text();
            items[index]['price'] = $(element).find('.price').text();
            items[index]['in_stock'] = $(element).find('.bin-stock-availability').text();
          });
        }
        else if (rec_msg.indexOf("barbell") == 0) {
          items[0] = {};
          items[0]['name'] = $('.product-title').text();
          items[0]['price'] = $('.price').text();
          items[0]['in_stock'] = $('.bin-stock-availability').text();
        }
        //console.log(items);
        return callback(items);
      }
    }
  );
}


function handleMessage(sender_psid, received_message) {
  let response;

  // Checks if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    var rec_msg = received_message.text.toLowerCase();

    // Help message
    if (rec_msg === "help") {
      var keys = Object.keys(search_urls);
      var key_string = "";
      for (var i = 0; i < keys.length; ++i) {
        key_string += keys[i] + "\n";
      }
      response = {
        "text": "Search for the following items: \n" + key_string +
          "Type `stop` to stop checking all items \n"
      };
      callSendAPI(sender_psid, response);
      return;
    }
    // Status message
    else if (rec_msg === "status") {
      var search_str = "Currently searching for:\n";
      for (var key in search_dic) {
        search_str += search_dic[key]['product-name'] +
          "\nTime elapsed: " + getTimeDiff(search_dic[key]['time-start']) + "\n\n";
      }
      response = {
        "text": search_str

      };
      callSendAPI(sender_psid, response);
      return;
    }
    // Stop message
    else if (rec_msg === "stop") {
      interval_id_list.forEach(clearInterval);
      var search_item_str = "";
      for (var key in search_dic) {
        search_item_str += search_dic[key]['product-name'] +
          "\nTime elapsed: " + getTimeDiff(search_dic[key]['time-start']) + "\n\n";
      }
      response = {
        "text": `Stopped checking ${interval_id_list.length} item(s):\n` +
          search_item_str
      };
      console.log(`Stopped checking ${interval_id_list.length} item(s)`);
      callSendAPI(sender_psid, response);
      return;
    }
    // User message is invalid
    if (!(rec_msg in search_urls)) {
      response = {
        "text": `You entered: "${
          received_message.text
          }".` + "\n\n" + "Item doesn't exist"
      };
      console.log(response);
      callSendAPI(sender_psid, response);
      return;
    }
    var search_url = search_urls[rec_msg];

    if (search_dic.length >= 4) {
      response = {
        "text": `You have hit the max limit of: "${
            item_limit
          }" items.`
      };
      console.log(response);
      callSendAPI(sender_psid, response);
      return;
    }

    // Previous count of item
    let prev_stock_count = 0;
    var interval_count = 0;
    // Interval to continous check website
    interval_id = setInterval(function () {
      response = getData(search_url, rec_msg, function (data) {
        let item_str = "";
        let in_stock_count = 0;

        // console.log(data);

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

        // Response message
        response = {
          "text": `You entered: "${received_message.text}"\n` +
            `Match found for: "${search_dic[rec_msg]['product-name']}".` +
            "\n\n" + item_str +
            "Checked On " + dateTime + "\n" +
            "Link " + search_url
        };

        // console.log("Interval count: " + interval_count);
        // console.log("Searching: " + rec_msg);
        // console.log("Searching " + interval_id_list.length + " items");
        // console.log("Prev stock count: " + prev_stock_count);
        // console.log("Curr stock count: " + in_stock_count + "\n");

        // If the stock amount changed from last check
        // Send a message on FB
        if (interval_count == 0 || (in_stock_count != prev_stock_count)) {
          console.log("Response msg:");
          console.log(response);
          callSendAPI(sender_psid, response);
        }
        interval_count += 1;
        // All items are in stock so clear interval
        if (in_stock_count == data.length) {
          clearInterval(interval_id);
        }
        // Set prev count to current stock
        prev_stock_count = in_stock_count;


      });
    }, delay * 1000);
    // Add to list of all interval ids
    interval_id_list.push(interval_id);

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
