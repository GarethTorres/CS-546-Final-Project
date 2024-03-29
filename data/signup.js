import { ObjectId } from 'mongodb';
import { signup } from '../config/mongoCollections';

const exportedMethods = {
    validateEmail(email) {
        let containsSymbol = false;
        for (let i = 0; i < email.length && (containsSymbol === false); i++) {
            if (email[i] === '@') {
                containsSymbol = true;
            }
        }
        return containsSymbol;
    },
    hasOneNumber(password) {
        let hasNumber = false;
        for (let i = 0; i < password.length && (hasNumber === false); i++) {
            if (typeof password[i] === 'number') {
                hasNumber = true;
            }
        }
        return hasNumber;
    },
    async validateSignUp(username, password, email, birthday) {
        try {
            if (typeof username !== 'string') {
                throw new Error('Username must be a string!');
            }
            if (username.trim().length === 0) {
                throw new Error('Username must not be empty');
            }
            if (typeof password !== 'string') {
                throw new Error('Password must be a string!');
            }
            if (password.trim().length < 8) {
                throw new Error('Password must be 8 characters or more.');
            }
            if (password.toLowerCase() === password) {
                throw new Error('There must be a capital letter in the password.');
            }
            if (!this.hasOneNumber(password)) {
                throw new Error('There must be one number in the password.');
            }
            if (typeof email !== 'string') {
                throw new Error('Email must be a string');
            }
            if (email.trim().length === 0) {
                throw new Error('Email must not be empty.');
            }
            if (!this.validateEmail(email)) {
                throw new Error('Invalid email format.');
            }
            // Code to handle valid sign up here
        } catch (error) {
            throw error;
        }
    }
};

export default exportedMethods;

