
require("dotenv").config();
const MongoClient = require('mongodb').MongoClient;
const mongo_url = process.env.MONGO_URL;
const client = new MongoClient(mongo_url, { useUnifiedTopology: true, useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("rogue").collection("items");
  collection.find().toArray().then(items => {
    console.log(`Successfully found ${items.length} documents.`);
    client.close();
  })
  .catch(err => console.log(`Failed to find ${err}`));
});
