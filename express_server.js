const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 8080 // default

app.set('view engine', 'ejs');

app.use(bodyParser());
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['lighthouse']
}));
app.use(express.static(__dirname + '/public'));

/**
 * [Function to return an random ID from A-Z.]
 * @return {[String]} [description]
 */
function makeRandomId() {
  randomId = Math.random().toString(36).replace(/^[A-Z]/).substring(2, 12);
  return randomId;
}

/**
 * [findUserByEmail description]
 * @return {[type]} [description]
 */
function findUserByEmail(email) {
  let foundUser = false;

  for (let key in users) {
    const user = users[key];

    if (email === user.email) {
      foundUser = user;
    }
  }
  return foundUser;
};

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
}

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

const routes = require('./routes/index.js');
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`\nListening on PORT: ${PORT}\n`)
});
