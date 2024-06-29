export const validatePassword = (password, confPassword = false, newPassword = '', oldPassword = '') => {
  const Message = [];

  // For Confirm Password

  if (confPassword) {
    if (password !== newPassword) {
      Message.push('Confirm password should match the new password.');
    }

    if (oldPassword === newPassword || password === oldPassword) {
      Message.push('New password cannot be the same as the current password.');
    }
  }

  // has uppercase letter
  if (password.toLowerCase() !== password) {
    // containsUL = true;
  } else {
    // containsUL = false;

    Message.push('1 uppercase characters');
  }

  // has lowercase letter
  if (password.toUpperCase() !== password) {
  } else {
    Message.push('1 lowercase characters');
  }

  // has number
  if (/\d/.test(password)) {
  } else {
    Message.push('1 digit');
  }

  // has special character
  if (/[~`!@#$%^&.*+=\-[\]\\';,/{}|\\":<>?]/g.test(password)) {
  } else {
    Message.push('1 special characters');
  }

  // has 10 characters
  if (password.length >= 10) {
  } else {
    Message.push('10 characters');
  }
  return Message;
};
