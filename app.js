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
  mysql = require('mysql'),
  express = require('express'),
  axios = require('axios'),
  cheerio = require('cheerio'),
  body_parser = require('body-parser'),
  util = require('util'),
  useless_items = require('./useless-items')
// creates express http server

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'rogue'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL Connected")

})

const app = express().use(body_parser.json());
const query = util.promisify(db.query).bind(db);

let start_time;
// Delay in seconds
let delay = 10;
// Limit of iteems
let item_limit = 4;

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/views/'));


// Sets server port and logs message on success
app.listen('3000', () => {
  console.log('webhook is listening');
  try {
    setInterval(handleAllURLs, delay * 1000);
  }
  catch (error) {
    console.log(`Error: ${error}`);
  }

});

// Home screen page
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/bot-guide', (req, res) => {
  res.render('bot-guide');
});

app.get('/terms', (req, res) => {
  res.render('terms');
});

app.get('/privacy-policy', (req, res) => {
  res.render('privacy-policy');
});

app.get('/current-items', (req, res) => {
  let stmt = `SELECT * FROM items`;
  db.query(stmt, (err, results, fields) => {
    if (err) throw err;
    res.render('current-items', { data: results });
  })

});

app.get('/stock-updates', (req, res) => {
  let stmt = `SELECT * FROM restock ORDER BY restock_id DESC`;
  let data_results = [];
  db.query(stmt, (err, results, fields) => {
    if (err) throw err;
    results.forEach((row) => {
      let restock_string = row['restock_string'];
      let str_split = restock_string.split(',');
      let new_row = {};
      new_row['restock_id'] = row['restock_id'];
      new_row['restock_time'] = row['restock_time'];
      new_row['full_name'] = row['full_name'];
      new_row['restock_string'] = str_split;
      new_row['link'] = row['link'];
      data_results.push(new_row);
    })
    res.render('stock-updates', { data: data_results });
  })

});


// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => { // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    body.entry.forEach(function (entry) { // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log("---MESSAGE RECEIVED---");
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender ID: ' + sender_psid + "\n");

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

// Functions start

async function handleAllURLs() {

  // Set start time
  start_time = new Date();
  var date = (start_time.getMonth() + 1) + '/' + start_time.getDate() + '/' + start_time.getFullYear();
  var time = start_time.toLocaleString('en-US',
    {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });
  start_time = time + ' EST ' + date;

  // Select all items to search for
  let stmt = 'SELECT * FROM items';
  db.query(stmt, async (err, item_results, fields) => {
    if (err) throw err;
    item_results.forEach(async (item) => {
      // Get data from item url
      let data = await getDataFromURL(item);
      let item_str = "";
      let write_item_str = "";
      // Stock count of current search
      let in_stock_count = 0;
      // Stock count of item previously in DB
      let prev_stock_count = item['stock_count'];
      let item_full_name = item['full_name'];
      let item_short_name = item['short_name'];

      // Loop through each item on page
      data.forEach((single_item) => {
        var avail = decodeURI('\u2705');

        // Check if data returned is empty
        if (Object.keys(single_item).length == 0) {
          return;
        }

        // Out of stock
        if (single_item['in_stock'].indexOf("Notify Me") >= 0 || single_item['in_stock'].indexOf("Out of Stock") >= 0) { // Cross emoji
          avail = decodeURI('\u274C');
        }
        // In stock
        else { // Check emoji
          avail = decodeURI('\u2705');
          in_stock_count += 1;
          write_item_str += single_item['name'] + " " + avail + ", "
          item_str += single_item['name'] + "\n" + single_item['price'] + "\nIn stock: " + avail + "\n \n"
        }
        //item_str += item['name'] + "\n" + item['price'] + "\nIn stock: " + avail + "\n \n"
      })

      // No items found, everything sold out
      if (item_str === "") {
        item_str = "Everything currently out of stock.\n\n";
        write_item_str = "Everything currently out of stock.";
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
      var dateTime = time + ' EST ' + date;

      // SQL gets all searches with this item_name
      stmt = `SELECT C.num_searches, S.* FROM searches S, 
              (SELECT COUNT(*) num_searches 
              FROM searches
              GROUP BY user_id) C
              WHERE item_name=?`;
      let args = [item_short_name];

      db.query(stmt, [args], (err, search_results, fields) => {
        if (err) throw err;

        // Loops through each user found
        search_results.forEach((user) => {
          let user_id = user['user_id'];
          let item_name = user['item_name'];
          let count = user['count'];
          let item_count = user['num_searches'];
          // First message
          if (count == 0) {
            let response = {
              "text":
                `FIRST CHECK: "${item_name}"\n` +
                `Match found for: "${item_full_name}".\n` +
                `Currently searching ${item_count}/${item_limit} items` +
                "\n\n" + item_str +
                `First initial check on ${dateTime}\n` +
                `You will be notified everytime there is a change in stock.\n` +
                `Will begin running in the background until "stop"\n` +
                `Link: ${item['link']}`
            };
            // SQL updates searches count to 1
            stmt = `UPDATE searches SET count=? WHERE user_id=? AND item_name=?`;
            args = [1, user_id, item_name]
            db.query(stmt, args, (err, results, fields) => {
              if (err) throw err;
            });
            callSendAPI(user_id, response);
          }
          // Change in stock count
          else if (in_stock_count != prev_stock_count) {
            // Response message
            let response = {
              "text":
                `RESTOCK: "${item_name}"\n` +
                `Match found for: "${item_full_name}".\n` +
                `Currently searching ${item_limit} items` +
                "\n\n" + item_str +
                "Checked On " + dateTime + "\n" +
                `Link: ${item['link']}`
            };
            callSendAPI(user_id, response);
          }
        });

        // SQL updates item stock count to current stock count
        stmt = `UPDATE items SET stock_count=? WHERE short_name=?`;
        args = [in_stock_count, item_short_name];
        db.query(stmt, args, (err, results, fields) => {
          if (err) throw err;
        });

        // Add items to restock log
        stmt = `INSERT INTO restock(restock_time, full_name, restock_string, link)
                VALUES(?,?,?,?)`;
        args = [dateTime, item_full_name, write_item_str, item['link']];
        // Item was in stock but is now out of stock
        if (prev_stock_count > 0 && in_stock_count == 0) {
          db.query(stmt, args, (err, results, fields) => {
            if (err) throw err;
            console.log(`MySql db: out of stock`);
          });
        }
        // Difference in stock count
        else if (in_stock_count != prev_stock_count) {
          db.query(stmt, args, (err, results, fields) => {
            if (err) throw err;
            console.log(`MySql db: restock`);
          });
        }
      });
    })
  });
}

// Parses HTML from URL and returns data structure containing relevent data
async function getDataFromURL(item) {
  var item_link = item['link'];
  var item_type = item['link_type'];
  try {
    let response = await axios.get(item_link);
    let redirect_count = response.request._redirectable._redirectCount;

    // console.log("Looking for: " + item['short_name']);
    // console.log("Web scraping data from: " + item_link);
    let $ = cheerio.load(response.data);
    var items = [];

    // Multiple items in a page
    if (item_type === "multi") {
      $('.grouped-item').each(function (index, element) {
        let item_name = $(element).find('.item-name').text();
        items[index] = {};
        // Check for useless items
        if (useless_items.indexOf(item_name) >= 0) {
          return;
        }
        items[index]['name'] = $(element).find('.item-name').text();
        items[index]['price'] = $(element).find('.price').text();
        items[index]['in_stock'] = $(element).find('.bin-stock-availability').text();
      });
    }
    else if (item_type === "bone") {
      // Boneyard page exists
      if (redirect_count == 0) {
        $('.grouped-item').each(function (index, element) {
          let item_name = $(element).find('.item-name').text();
          items[index] = {};
          // Check for useless items
          if (useless_items.indexOf(item_name) >= 0) {
            return;
          }
          items[index]['name'] = $(element).find('.item-name').text();
          items[index]['price'] = $(element).find('.price').text();
          items[index]['in_stock'] = $(element).find('.bin-stock-availability').text();
        });
      }
      else {
        items[0] = {};
        items[0]['in_stock'] = 'Notify Me';
      }
    }
    // Just one item in a page
    else {
      items[0] = {};
      items[0]['name'] = $('.product-title').text();
      items[0]['price'] = $('.price').text();
      items[0]['in_stock'] = $('.product-options-bottom button').text();
    }
    return items;
  }
  catch (error) {
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

// Handles messages from sender
async function handleMessage(sender_psid, received_message) {
  let response;

  // Checks if the message contains text
  if (received_message.text) {

    let rec_msg = received_message.text.toLowerCase();
    let item_full_name = rec_msg;

    // Help message
    if (rec_msg === "help") {

      let all_items_str = "";

      let stmt = `SELECT * FROM items`;
      db.query(stmt, (err, results, fields) => {
        if (err) throw err;
        results.forEach((row) => {
          all_items_str += row['short_name'] + "\n";
        })
        response = {
          "text": `HELP MSG:\n` +
            `For commands check out\n` +
            `roguestockbot.com/current-items \n` +
            "Type `stop` to stop checking all items \n"
        };
        callSendAPI(sender_psid, response);
      });
      return;
    }
    // Status message
    else if (rec_msg === "status") {
      let total_users = 0;
      let stmt = 'SELECT COUNT(DISTINCT user_id) AS user_count FROM searches';
      db.query(stmt, (err, results, fields) => {
        if (err) throw err;
        total_users = results[0].user_count;
      });

      let adr = sender_psid;
      stmt = `SELECT * FROM searches
                  WHERE user_id = ?`;
      db.query(stmt, [adr], (err, results, fields) => {
        if (err) throw err;
        let status_string = `STATUS ${results.length}/${item_limit} items:\n` +
          `There are ${total_users} total users searching\n\n`;
        results.forEach((row) => {
          status_string += row['item_name'] + " / " + row['item_full_name'] +
            "\nTime elapsed: " + getTimeDiff(row['start_time']) + "\n\n";
        });
        let response = {
          "text": status_string
        };
        callSendAPI(sender_psid, response);
      });
      return;
    }
    // Stop message
    else if (rec_msg === "stop") {

      let adr = sender_psid;
      // Get records to make string
      let stmt = `SELECT * FROM searches
                  WHERE user_id = ?`;
      let deleted_str = ``;
      db.query(stmt, [adr], (err, results, fields) => {
        if (err) throw err;
        results.forEach((row) => {
          deleted_str += row['item_name'] + " / " + row['item_full_name'] +
            "\nTime elapsed: " + getTimeDiff(row['start_time']) + "\n\n";
        });
      });

      // Delete records
      stmt = `DELETE FROM searches
                  WHERE user_id = ?`;
      db.query(stmt, [adr], (err, results, fields) => {
        if (err) throw err;
        let stop_string = `STOP MSG:\n` +
          `Stopped checking ${results.affectedRows} item(s):\n\n`;
        stop_string += deleted_str;
        let response = {
          "text": stop_string
        };
        callSendAPI(sender_psid, response);
      });
      return;
    }


    // Check for invalid items
    let stmt = `SELECT * FROM items WHERE short_name=?`;
    let todo = [rec_msg];
    try {
      const results = await query(stmt, todo);
      if (results.length == 0) {
        response = {
          "text": `INVALID\nYou entered: "${
            received_message.text
            }".` + "\n\n" +
            "Item doesn't exist\nTry typing `help` for a list of all valid commands"
        };
        callSendAPI(sender_psid, response);
        return;
      }
      else {
        item_full_name = results[0]['full_name'];
      }
    }
    catch (err) {
      console.log(`Error in checking item database: ${err}`);
    }

    // Check for item limit
    stmt = `SELECT * FROM searches WHERE user_id=?`;
    todo = [sender_psid];
    const search_results = await query(stmt, todo);
    if (search_results.length >= item_limit) {
      response = {
        "text": `INVALID\nYou have reached max limit of "${item_limit}" items\n`
      };
      callSendAPI(sender_psid, response);
      return;
    }

    // Insert valid search into database
    stmt = `INSERT INTO searches (user_id, item_name, item_full_name, start_time, count)
               VALUES (?, ?, ?, ?, ?)`;
    todo = [sender_psid, rec_msg, item_full_name, new Date(), 0];
    try {
      await query(stmt, todo);
    }
    catch (err) {
      // Check if item is already being searched for user
      if (err.code == "ER_DUP_ENTRY") {
        response = {
          "text": `INVALID\nAlready searching: "${
            item_full_name
            }".`
        };
        callSendAPI(sender_psid, response);
        return;
      }
      // Other errors
      else {
        throw err;
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
        console.log('---MESSAGE SENT!---\n');
      }
      else {
        console.error("Unable to send message:" + err);
      }
    }
  );
}
