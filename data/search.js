import { ObjectId } from 'mongodb';
import validation from './validation.js';

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function searchUser(email) {
  try {
    validation.validEmail(email);

    await client.connect();

    const database = client.db('mydb');
    const users = database.collection('users');

    const user = await users.findOne({ 'id' });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw error;
  } finally {
    await client.close();
  }
}

export default searchUser;

