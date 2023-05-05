import { ObjectId } from 'mongodb';

async function searchUserByName(name) {
  const client = new MongoClient(process.env.MONGODB_URI, { useUnifiedTopology: true });
  try {
    await client.connect();

    const database = client.db(process.env.MONGODB_DB_NAME);
    const usersCollection = database.collection('users');

    const query = { name: { $regex: `.*${name}.*`, $options: 'i' } };
    const options = { projection: { _id: 0, name: 1, email: 1 } };
    const result = await usersCollection.find(query, options).toArray();

    return result;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while searching for users');
  } finally {
    await client.close();
  }
}

export default { searchUserByName };
