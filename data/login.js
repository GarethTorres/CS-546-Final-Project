const validateLogin = (userid, password) => {
  if (typeof userid !== 'string') {
    throw new Error('Error: User ID must be a string!');
  }
  if (userid.trim().length === 0) {
    throw new Error('Error: User ID must not be empty!');
  }
  if (typeof password !== 'string') {
    throw new Error('Error: Password must be a string!');
  }
  if (password.trim().length === 0) {
    throw new Error('Error: Password must not be empty!');
  }
};

export default { validateLogin };

