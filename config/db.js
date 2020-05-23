const assert = require('assert');

const { MongoClient, ObjectID } = require('mongodb');

const debug = require('debug');

const log = debug('guess:dbConnection');

const dateformat = require('dateformat');

// Connection URL
const dbUrl =
  'mongodb://paf:test@cluster0-shard-00-00-a9iog.mongodb.net:27017,cluster0-shard-00-01-a9iog.mongodb.net:27017,cluster0-shard-00-02-a9iog.mongodb.net:27017/test?ssl=true&replicaSet=cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';
// Database name
const dbName = 'GuessingGame';

const client = new MongoClient(dbUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

let db;

async function initDb() {
  if (db) {
    log('Trying to init DB again!');
    return;
  }
  try {
    await client.connect();
    log('Connected to MongoDB Atlas correctly');
    db = client.db(dbName);
    log(`DB initialized - connected to: ${dbUrl.split('@')[1]} `);
  } catch (err) {
    log(`${err.stack}`);
  }
}

function getDb() {
  assert.ok(db, 'Db has not been initialized. Please call initDb() first.');
  return db;
}

async function findByUsername(username) {
  assert.ok(db, 'DB has not been initialized. Please call initDb() first.');
  // const users = db.collection('users');
  try {
    const query = { username };
    const user = await db.collection('users').findOne({ username });
    log(user);
    return user;
  } catch (err) {
    log(err);
  }
}

async function findById(id) {
  assert.ok(db, 'DB has not been initialized. Please call initDb() first.');
  const users = db.collection('users');
  try {
    const user = await users.findOne({ _id: ObjectID(id) });
    if (user) {
      log('User found by username...');
      return user;
    }
    return null;
  } catch (err) {
    log(err);
  }
}

async function createUser(newUser) {
  assert.ok(db, 'DB has not been initialized. Please call initDb() first.');
  const users = db.collection('users');

  try {
    const result = await users.insertOne(newUser);
    assert.equal(result.insertedCount, 1, 'error inserting new user');
  } catch (err) {
    log(`${err.stack}`);
  }
}
module.exports = {
  getDb,
  initDb,
  findByUsername,
  findById,
  createUser,
};
