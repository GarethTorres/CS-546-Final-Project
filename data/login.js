import { ObjectId } from 'mongodb';
import { login } from '../config/mongoCollections';

const validateLogin = async (username, password) => {
    try {
        if (typeof username !== 'string') {
            throw new Error('Username must be a string!');
        }
        if (username.trim().length === 0) {
            throw new Error('Username must not be empty!');
        }
        if (typeof password !== 'string') {
            throw new Error('Password must be a string!');
        }
        if (password.trim().length === 0) {
            throw new Error('Password must not be empty!');
        }
    } catch (error) {
        throw error;
    }
};

export default { validateLogin };

