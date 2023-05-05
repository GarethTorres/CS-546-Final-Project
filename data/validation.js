import emailValidator from 'email-validator';
import { ObjectId } from 'mongodb';

function validString(string) {
  if (typeof string !== 'string' || !string) {
    throw new Error('Invalid string');
  }
  if (string.trim().length < 1) {
    throw new Error('Invalid string');
  }
  return true;
}

function validEmail(email) {
  if (!emailValidator.validate(email)) {
    throw new Error('Invalid email');
  }
  return true;
}

function validDate(date) {
  validString(date);
  let splitDate = date.split('/');

  if (splitDate[0].length > 2 || splitDate[0].length < 1) {
    throw new Error('Invalid date');
  }
  if (splitDate[1].length > 2 || splitDate[0].length < 1) {
    throw new Error('Invalid date');
  }
  if (splitDate[2].length !== 4) {
    throw new Error('Invalid date');
  }

  let dateObj = new Date(date);
  if (!dateObj) {
    throw new Error('Invalid date');
  }

  return true;
}

function validAge(date) {
  let today = new Date();
  let dob = new Date(date);
  let age = today.getFullYear() - dob.getFullYear();
  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate < dob.getDate())
  ) {
    age -= 1;
  }

  if (age < 21) {
    throw new Error('Invalid age');
  }
  return true;
}

function validId(id) {
  if (!ObjectId.isValid(id) || !validString(id)) {
    throw new Error('Invalid ID');
  }
  return true;
}

function validPassword(password) {
  if (!validString(password)) {
    throw new Error('Invalid password');
  }
  if (password.length < 8) {
    throw new Error('Invalid password');
  }
  if (password === password.toLowerCase()) {
    throw new Error('Invalid password');
  }

  let pwSplit = password.split('');
  let count = 0;
  for (let char of pwSplit) {
    let numCheck = parseInt(char);
    if (typeof numCheck === 'number') count += 1;
  }

  if (count < 1) {
    throw new Error('Invalid password');
  }
  return true;
}

export default {
  validString,
  validEmail,
  validDate,
  validId,
  validAge,
  validPassword,
};
