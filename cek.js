const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://rfebriyan99:123@ukm.169zyon.mongodb.net/?retryWrites=true&w=majority&appName=ukm";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("ukm");
    const admins = await db.collection("admin").find().toArray();
    console.log("Data admin:", admins);
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
  } finally {
    await client.close();
  }
}

run();
