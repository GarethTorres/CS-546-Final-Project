import emailValidator from 'email-validator';
import { ObjectId } from 'mongodb';

export function validString(string) {
  if (typeof string !== 'string' || !string) return false;
  if (string.trim().length < 1) return false;
  return true;
}

export function validEmail(email) {
  return emailValidator.validate(email);
}

export function validDate(date) {
  validString(date);
  let splitDate = date.split('/');

  if (splitDate[0].length > 2 || splitDate[0].length < 1) return false;
  if (splitDate[1].length > 2 || splitDate[0].length < 1) return false;
  if (splitDate[2].length !== 4) return false;

  let dateObj = new Date(date);
  if (!dateObj) return false;

  return true;
}

export function validAge(date) {
  let today = new Date();
  let dob = new Date(date);
  let age = today.getFullYear() - dob.getFullYear();
  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age -= 1;
  }

  if (age < 21) return false;
  return true;
}

export function validId(id) {
  if (!ObjectId.isValid(id) || !validString(id)) return false;
  return true;
}

export function validPassword(password) {
  if (!validString(password)) return false;
  if (password.length < 8) return false;
  if (password === password.toLowerCase()) return false;

  let pwSplit = password.split('');
  let count = 0;
  for (let char of pwSplit) {
    let numCheck = parseInt(char);
    if (typeof numCheck === 'number') count += 1;
  }

  if (count < 1) return false;
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
