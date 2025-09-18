import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://arjundivraniyacg_db_user:lGTHA6zdRWWJIhN6@cluster0.0rlg2cx.mongodb.net/";
const client = new MongoClient(uri);

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const databaseName = "woekbook"; // Replace with your database name
    cached.promise = client.connect().then(c => c.db(databaseName));
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}