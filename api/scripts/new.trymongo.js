/**
 * To test:
 * node scripts/new.trymongo.js
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = process.env.DB_URL || 'mongodb://localhost/expensetracker';

function testWithCallbacks(callback) {
  console.log('\n--- testWithCallbacks ---');
  const client = new MongoClient(url, { useNewUrlParser: true });
  client.connect((connErr) => {
    if (connErr) {
      callback(connErr);
      return;
    }
    console.log('Connected to MongoDB URL', url);

    const db = client.db();
    const collection = db.collection('testExpenses');

    const expense = { id: 1, title: 'Fast and Furious', amount: 50 };
    collection.insertOne(expense, (insertErr, result) => {
      if (insertErr) {
        client.close();
        callback(insertErr);
        return;
      }
      console.log('Result of insert:\n', result.insertedId);
      collection.find({ _id: result.insertedId })
        .toArray((findErr, docs) => {
          if (findErr) {
            client.close();
            callback(findErr);
            return;
          }
          console.log('Result of find:\n', docs);
          client.close();
          callback();
        });
    });
  });
}

async function testWithAsync() {
  console.log('\n--- testWithAsync ---');
  const client = new MongoClient(url, { useNewUrlParser: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB URL', url);
    const db = client.db();
    const collection = db.collection('testExpenses');

    const expense = { id: 2, title: 'Hiking', amount: 6 };
    const result = await collection.insertOne(expense);
    console.log('Result of insert:\n', result.insertedId);

    const docs = await collection.find({ _id: result.insertedId })
      .toArray();
    console.log('Result of find:\n', docs);
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

testWithCallbacks((err) => {
  if (err) {
    console.log(err);
  }
  testWithAsync();
});
