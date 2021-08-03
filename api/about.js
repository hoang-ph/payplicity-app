const { mustBeSignedIn } = require('./auth.js');

let aboutMessage = 'Issue Tracker API v1.0';

function setAboutMessage(_, { message }) {
  aboutMessage = message;
  return aboutMessage;
}

function getMessage() {
  return aboutMessage;
}

module.exports = { getMessage, setAboutMessage: mustBeSignedIn(setAboutMessage) };
