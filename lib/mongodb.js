import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error('❌ MONGODB_URI belum diset di file .env.local');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // Gunakan cache global hanya di development agar tidak reconnect tiap reload
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Di production selalu buat instance baru
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
