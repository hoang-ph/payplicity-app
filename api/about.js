const { mustBeSignedIn } = require('./auth.js');

let aboutMessage = 'Payplicity v.0.0.1';

function setAboutMessage(_, { message }) {
  aboutMessage = message;
  return aboutMessage;
}

function getMessage() {
  return aboutMessage;
}

module.exports = { getMessage, setAboutMessage: mustBeSignedIn(setAboutMessage) };
