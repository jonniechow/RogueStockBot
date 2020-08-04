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

require('dotenv').config();

const PAGE_ACCESS_TOKEN = process.env.TEST_ACCESS_TOKEN;
// Imports dependencies and set up http server
const request = require('request');
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const fs = require('fs');
const readline = require('readline');
const Stream = require('stream');
const fuzzyset = require('fuzzyset.js');
const searchUrls = require('./item-urls');
const uselessItems = require('./useless-items');
const {getRequestDataFromJS} = require('./helper');

const app = express().use(bodyParser.json());

// Dictionary of user_id to items they are searching
const userToID = {};
let startTime;
// Delay in seconds
const delay = 10;
// Limit of iteems
const itemLimit = 10;

app.set('view engine', 'ejs');

app.use(express.static(`${__dirname}/views/`));

function getTimeDiff(startingTime) {
  const currTime = new Date();
  let timeElapsed = (currTime - startingTime) / 1000;

  const seconds = Math.round(timeElapsed % 60);
  // remove seconds from the date
  timeElapsed = Math.floor(timeElapsed / 60);

  // get minutes
  const minutes = Math.round(timeElapsed % 60);

  // remove minutes from the date
  timeElapsed = Math.floor(timeElapsed / 60);

  // get hours
  const hours = Math.round(timeElapsed % 24);

  // remove hours from the date
  timeElapsed = Math.floor(timeElapsed / 24);
  const timeElapsedStr = `${timeElapsed} days ${hours}:${minutes}:${seconds}`;
  return timeElapsedStr;
}

function callSendAPI(senderPsid, response) {
  // Construct the message body
  const requestBody = {
    recipient: {
      id: senderPsid,
    },
    message: response,
    tag: 'CONFIRMED_EVENT_UPDATE',
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {
        access_token: PAGE_ACCESS_TOKEN,
      },
      method: 'POST',
      json: requestBody,
    },
    (err, res, body) => {
      if (!err) {
        console.log('---MESSAGE SENT!---\n');
      } else {
        console.error(`Unable to send message:${err}`);
      }
    },
  );
}

// Parses HTML from URL and returns data structure containing relevent data
async function getDataFromURL(item) {
  const itemUrlDict = searchUrls[item];
  const itemLink = itemUrlDict.link;
  let items = [];
  try {
    const response = await axios.get(itemLink);
    const redirectCount = response.request._redirectable._redirectCount;
    const itemType = itemUrlDict.type;

    // console.log("Looking for: " + item);
    // console.log(redirectCount);
    // console.log("Web scraping data from: " + itemLink);
    const $ = cheerio.load(response.data);

    // Multiple items in a page
    if (itemType === 'multi') {
      $('.grouped-item').each((index, element) => {
        const itemName = $(element).find('.item-name').text();
        items[index] = {};
        // Check for useless items
        if (uselessItems.indexOf(itemName) >= 0) {
          return;
        }
        items[index].name = $(element).find('.item-name').text();
        items[index].price = $(element).find('.price').text();
        items[index].in_stock = $(element)
          .find('.bin-stock-availability')
          .text();
      });
    } else if (itemType === 'bone') {
      // Boneyard page exists
      if (redirectCount === 0) {
        $('.grouped-item').each((index, element) => {
          items[index] = {};
          items[index].name = $(element).find('.item-name').text();
          items[index].price = $(element).find('.price').text();
          items[index].in_stock = $(element)
            .find('.bin-stock-availability')
            .text();
        });
      } else {
        items[0] = {};
        items[0].in_stock = 'Notify Me';
      }
    } else if (itemType === 'grab bag') {
      // Boneyard page exists
      if (redirectCount === 0) {
        items = getRequestDataFromJS(response.data, 'RogueColorSwatches');
      } else {
        items[0] = {};
        items[0].in_stock = 'Notify Me';
      }
    } else if (itemType === 'cerakote') {
      items = getRequestDataFromJS(response.data, 'relatedColorSwatches');
    } else if (itemType === 'monster bench') {
      items = getRequestDataFromJS(response.data, 'RogueColorSwatches', 5);
    } else if (itemType === 'rmlc') {
      items = getRequestDataFromJS(response.data, 'RogueColorSwatches', 11);
    } else if (itemType === 'trolley') {
      items = getRequestDataFromJS(response.data, 'RogueColorSwatches', 4);
    } else if (itemType === 'db15') {
      items = getRequestDataFromJS(response.data, 'RogueColorSwatches', 2);
    } else if (itemType === 'custom2') {
      items = getRequestDataFromJS(response.data, 'RogueColorSwatches');
    } else if (itemType === 'custom') {
      items = getRequestDataFromJS(response.data, 'ColorSwatches');
    } else if (itemType === 'ironmaster') {
      items[0] = {};
      items[0].name = $('.product_title').text();
      items[0].price = 'N/A';
      items[0].in_stock = $('span.stock').text();
    }
    // Just one item in a page
    else {
      items[0] = {};
      items[0].name = $('.product-title').text();
      items[0].price = $('.price').text();
      items[0].in_stock = $('.product-options-bottom button').text();
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
  return items;
}

async function handleAllURLs() {
  Object.keys(searchUrls).forEach(async (item) => {
    // Skips items no one is looking for
    if (Object.keys(searchUrls[item].senderIDs).length === 0) {
      // console.log(`Skipping ${item}`)
      return;
    }
    const data = await getDataFromURL(item);
    let itemStr = '';
    let writeItemStr = '';
    let inStockCount = 0;
    const randString = Math.random().toString(36).substring(7);

    const link = searchUrls[item].link.split('/');
    const caLink = `https://www.roguecanada.ca/${link[3]}`;

    // Loop through each item on page
    data.forEach((singleItem) => {
      let avail = decodeURI('\u2705');

      // Check if data returned is empty
      if (Object.keys(singleItem).length === 0) {
        return;
      }
      // Out of stock
      if (
        singleItem.in_stock.indexOf('Notify Me') >= 0 ||
        singleItem.in_stock.indexOf('Out of Stock') >= 0 ||
        singleItem.in_stock.indexOf('OUT OF STOCK') >= 0
      ) {
        // Cross emoji
        avail = decodeURI('\u274C');
      }
      // In stock
      else {
        // Check emoji
        avail = decodeURI('\u2705');
        inStockCount += 1;
        writeItemStr += `${singleItem.name} ${avail}, `;
        // itemStr += `${singleItem.name}\n${singleItem.price}\nIn stock: ${avail}\n \n`;
        // Update item's last availablity to current time
        searchUrls[item].last_avail = new Date();
      }

      itemStr += `${singleItem.name}\n${singleItem.price}\nIn stock:${avail}\n \n`;
    });

    // No items found, everything sold out
    if (itemStr === '') {
      itemStr = 'Everything currently out of stock.\n\n';
      writeItemStr = 'Everything currently out of stock.';
    }

    searchUrls[item].itemString = writeItemStr.split(',');

    // Set date
    const today = new Date();
    const date = `${
      today.getMonth() + 1
    }/${today.getDate()}/${today.getFullYear()}`;
    const time = today.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });
    const dateTime = `${time} EST ${date}`;

    // Send response to every user
    Object.keys(searchUrls[item].senderIDs).forEach((senderID) => {
      if (searchUrls[item].senderIDs[senderID] === 0) {
        searchUrls[item].senderIDs[senderID] = 1;
        // First response message
        const response = {
          text:
            `${
              `FIRST CHECK: "${item}"\n` +
              `Match found for: "${searchUrls[item].product_name}".\n` +
              `Currently searching ${
                Object.keys(userToID[senderID].products).length
              }/${itemLimit} items` +
              '\n\n'
            }${itemStr}First initial check on ${dateTime}\n` +
            `You will be notified everytime there is a change in stock.\n` +
            `Will begin running in the background until "stop"\n\n` +
            `Link:\n${searchUrls[item].link}?=${randString}\n\n` +
            `CA link:\n${caLink}?=${randString}\n\n` +
            `If this bot has helped you get your items please consider donating!\npaypal.me/roguestockbot`,
        };
        callSendAPI(senderID, response);
      }
    });

    // Checks if item has been checked
    if (!('prev_stock_count' in searchUrls[item])) {
      searchUrls[item].prev_stock_count = inStockCount;
    }
    // If item was in stock, but is now out of stock
    else if (inStockCount === 0 && searchUrls[item].prev_stock_count > 0) {
      const writeLine = `${dateTime} | ${searchUrls[item].product_name} | ${writeItemStr} | ${searchUrls[item].link}\n`;
      try {
        if (writeItemStr !== '') {
          fs.appendFile('stock-log.txt', writeLine, (error) => {
            if (error) throw error;
            console.log(`Wrote update on ${item} to file`);
          });
        }
      } catch (error) {
        console.error(`Could not write to file`);
      }
    }
    // Difference in stock count
    else if (inStockCount !== searchUrls[item].prev_stock_count) {
      console.log('Response msg: Update in stock');
      // Send response to every user
      Object.keys(searchUrls[item].senderIDs).forEach((senderID) => {
        // Response message
        const response = {
          text:
            `${
              `RESTOCK: "${item}"\n` +
              `Match found for: "${searchUrls[item].product_name}".\n` +
              `Currently searching ${
                Object.keys(userToID[senderID].products).length
              }/${itemLimit} items` +
              '\n\n'
            }${itemStr}Checked On ${dateTime}\n` +
            `Link:\n${searchUrls[item].link}?=${randString}\n\n` +
            `CA link:\n${caLink}?=${randString}\n\n` +
            `If this bot has helped you get your items please consider donating!\npaypal.me/roguestockbot`,
        };
        callSendAPI(senderID, response);
      });
      const writeLine = `${dateTime} | ${searchUrls[item].product_name} | ${writeItemStr} | ${searchUrls[item].link}\n`;
      try {
        if (writeItemStr !== '') {
          fs.appendFile('stock-log.txt', writeLine, (error) => {
            if (error) throw error;
            console.log(`Wrote update on ${item} to file`);
          });
        }
      } catch (error) {
        console.error(`Could not write to file`);
      }
    }
    // Update prev stock to current stock
    searchUrls[item].prev_stock_count = inStockCount;
  });
}

// Handles messages from sender
function handleMessage(senderPsid, receivedMessage) {
  let response;

  // Checks if the message contains text
  if (receivedMessage.text) {
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    const recMsg = receivedMessage.text.toLowerCase();

    // Checks if user is in dict, if not creates entry
    if (!(senderPsid in userToID)) {
      userToID[senderPsid] = {
        products: {},
        'start-date': {},
        intervals: [],
      };
    }

    // Set start time
    if (Object.keys(userToID).length === 1) {
      startTime = new Date();
      const date = `${
        startTime.getMonth() + 1
      }/${startTime.getDate()}/${startTime.getFullYear()}`;
      const time = startTime.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      });
      startTime = `${time} EST ${date}`;
    }

    // Help message
    if (recMsg === 'help') {
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
          `Type 'stop {item command}' to stop checking a specific item. Ex: 'stop barbell op ss'\n` +
          `Type 'stop' to stop checking all items\n`,
      };
      callSendAPI(senderPsid, response);
      return;
    }
    // Status message
    if (recMsg === 'status') {
      let searchStr =
        `STATUS ${
          Object.keys(userToID[senderPsid].products).length
        }/${itemLimit} items:\n` +
        `There are ${Object.keys(userToID).length} total users searching\n\n`;
      Object.keys(userToID[senderPsid].products).forEach((key) => {
        searchStr +=
          `${searchUrls[key].product_name} / ${key}\n` +
          `People searching: ${
            Object.keys(searchUrls[key].senderIDs).length
          }\n` +
          `Last in stock: ${
            searchUrls[key].last_avail !== null
              ? getTimeDiff(searchUrls[key].last_avail)
              : 'N/A'
          }\n` +
          `Time elapsed: ${getTimeDiff(
            userToID[senderPsid].products[key],
          )}\n\n`;
      });
      searchStr += `Last reset: ${startTime}\n\nIf this bot has helped you get your items please consider donating!\npaypal.me/roguestockbot`;
      response = {
        text: searchStr,
      };
      callSendAPI(senderPsid, response);
      return;
    }
    // Stop message
    if (recMsg === 'stop') {
      userToID[senderPsid].intervals.forEach(clearInterval);
      let searchItemStr = '';
      Object.keys(userToID[senderPsid].products).forEach((key) => {
        delete searchUrls[key].senderIDs[senderPsid];
        searchItemStr += `${
          searchUrls[key].product_name
        }\nTime elapsed: ${getTimeDiff(
          userToID[senderPsid].products[key],
        )}\n\n`;
      });

      response = {
        text: `${
          `STOP MSG:\n` +
          `Stopped checking ${
            Object.keys(userToID[senderPsid].products).length
          } item(s):\n\n`
        }${searchItemStr}`,
      };
      userToID[senderPsid].intervals = [];
      userToID[senderPsid].products = {};
      delete userToID[senderPsid];
      callSendAPI(senderPsid, response);
      return;
    }
    // Stop single item
    if (recMsg.split(' ')[0] === 'stop') {
      const stopItemMessage = recMsg.split(' ');
      try {
        if (stopItemMessage.length > 1) {
          const itemToDelete = stopItemMessage.slice(1).join(' ');
          // If item is currently being searched by user
          if (itemToDelete in userToID[senderPsid].products) {
            delete userToID[senderPsid].products[itemToDelete];
          } else {
            throw new Error('Item not being searched by user');
          }
          if (senderPsid in searchUrls[itemToDelete].sender) {
            delete searchUrls[itemToDelete].senderIDs[senderPsid];
          } else {
            throw new Error('Item not being searched by user');
          }
          response = {
            text: `STOP MSG:\nStopped checking '${itemToDelete}'`,
          };
          callSendAPI(senderPsid, response);
          return;
        }
        throw new Error('Invalid stop message');
      } catch (err) {
        response = {
          text: `INVALID:\nERROR: ${err}`,
        };
        callSendAPI(senderPsid, response);
        return;
      }
    }

    // User message is invalid
    if (!(recMsg in searchUrls)) {
      response = {
        text:
          `INVALID\n` +
          `You entered: "${receivedMessage.text}".\n` +
          `Item doesn't exist.\n`,
      };

      // Determines the closest product in response to user error
      const closestMatch = function getClosestMatch() {
        const fuzzySet = fuzzyset(Object.keys(searchUrls));
        // Closest word must be at least 75% similar otherwise no suggestion is made
        const closest = fuzzySet.get(receivedMessage.text, null, 0.75);
        if (closest === null) {
          return `\n`;
        }
        return `Did you mean "${closest[0][1]}"?\n\n`;
      };

      response.text += `${closestMatch()}Go to roguestockbot.com/current-items for all supported items`;
      callSendAPI(senderPsid, response);
      return;
    }

    // Check current amount of items
    if (Object.keys(userToID[senderPsid].products).length >= itemLimit) {
      response = {
        text: `INVALID\nYou have reached max limit of "${itemLimit}" items\n`,
      };
      callSendAPI(senderPsid, response);
      return;
    }

    // Check if item is already being searched for user
    if (recMsg in userToID[senderPsid].products) {
      response = {
        text: `INVALID\nAlready searching: "${searchUrls[recMsg].product_name}".\n`,
      };
      callSendAPI(senderPsid, response);
      return;
    }
    userToID[senderPsid].products[recMsg] = new Date();

    // Check if senderPsid is in dic for url
    if (!(senderPsid in searchUrls[recMsg].senderIDs)) {
      searchUrls[recMsg].senderIDs[senderPsid] = 0;
    }
  }

  // Send the response message
  callSendAPI(senderPsid, response);
}

app.listen(process.env.PORT || 1337, () => {
  console.log('webhook is listening');
  try {
    setInterval(handleAllURLs, delay * 1000);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
});

// Home screen page
app.get('/', (req, res) => {
  res.render('index', {users: userToID, startTime});
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
  const sortedSearchUrls = {};
  Object.keys(searchUrls)
    .sort()
    .forEach((key) => {
      sortedSearchUrls[key] = searchUrls[key];
    });
  res.render('current-items', {data: sortedSearchUrls, users: userToID});
});

app.get('/items-in-stock', (req, res) => {
  res.render('items-in-stock', {data: searchUrls});
});

app.get('/stock-updates', (req, res) => {
  const instream = fs.createReadStream('stock-log.txt');
  const outstream = new Stream();
  const rl = readline.createInterface(instream, outstream);
  const dataFromLog = {item_info: []};
  rl.on('line', (line) => {
    // Process line here
    const words = line.split('|');
    const items = words[2].split(',');
    const stockUpdatesInfo = {
      time: words[0],
      name: words[1],
      items,
      link: words[3],
    };
    dataFromLog.item_info.unshift(stockUpdatesInfo);
  });
  rl.on('close', function closeFile() {
    dataFromLog.item_info = dataFromLog.item_info.slice(0, 100);
    res.render('stock-updates', {data: dataFromLog});
  });
});

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {
  // Parse the request body from the POST
  const {body} = req;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {
    body.entry.forEach((entry) => {
      // Gets the body of the webhook event
      const webhookEvent = entry.messaging[0];
      console.log('---MESSAGE RECEIVED---');
      // console.log(webhookEvent);

      // Get the sender PSID
      const senderPsid = webhookEvent.sender.id;
      console.log(`Sender ID: ${senderPsid}\n`);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhookEvent.message) {
        handleMessage(senderPsid, webhookEvent.message);
      }
    });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
  /** UPDATE YOUR VERIFY TOKEN * */
  const VERIFY_TOKEN = 'VERIFY_TOKEN';

  // Parse params from the webhook verification request
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
