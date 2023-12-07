import { MongoClient } from 'mongodb';
import debug from 'debug';

const debugDatabase = debug('app:Database');

let _db = null;

const newId = (str) => new ObjectId(str);

async function connect() {
  if (!_db) {
    const connectionString = process.env.DB_URL;
    const dbName = process.env.DB_NAME;
    const client = await MongoClient.connect(connectionString);
    _db = client.db(dbName);
  }
  return _db;
}

async function ping() {
  const db = await connect();
  const pong = await db.command({ ping: 1 });
  debugDatabase(pong);
}

async function createUser(user) {
  const db = await connect();
  const result = await db.collection('user').insertOne(user);
  return result;
}

async function getUserById(id) {
  const db = await connect();
  const result = await db.collection('user').findOne({ id: id });
  return result;
}

ping();

export { ping, createUser, getUserById };
