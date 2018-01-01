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

app.get('/', (req, res) => {
  res.redirect('urls_home');
});
app.get('/urls_home', (req, res) => {
  const loggedInUser = req.session.user_id;
  console.log('\nSession for logged in user: ', loggedInUser);
  res.render('urls_home');
})

app.get('/hello', (req, res) => {
  res.send(`\nURL Database: ${urlDatabase}`);
});

// TODO: Add new route handler ('/urls') and use res.render() to pass url
// data to the url_index.ejs template.
app.get('/urls', (req, res) => {
  const userLoggedIn = req.session.user_id;
  if (!userLoggedIn) {
    res.status(401).send(`Unauthorized access! Have you logged in? Click <a href='/login'>here</a>`)
    res.redirect('/');
  } else {
    res.render('urls_index', {
      urls: urlDatabase,
      shortURL: req.params.id
    });
    res.redirect('/urls');
  }
});

// TODO: Now you're going to add another page,
// this one for displaying a single URL and its shortened form.
// The end point for such a page will be in the format /urls/b2xVn2,
// which in this example means it's the page for the URL with the shortened
// form (or ID) b2xVn2.
// TODO: Create a new template file inside the views directory called
// urls_show.ejs.
// TODO: Fill out the urls_show.ejs template to display the following:
// The full URL and its shortened form.
app.get('/urls/:id', (req, res) => {
  const shortURL = req.params.id
  res.render('urls_show', {
    urls: urlDatabase,
    shortURL: shortURL,
    longURL: urlDatabase[shortURL]
  });
});

app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id]
});

// TODO: In our urls_index.ejs template we will add a form element for
// each shortened URL. The form should use POST method:
// TODO: Add a POST route that removes a URL resource: POST /urls/:id/delete
// TODO: After the resource has been deleted, redirect the client back to the
// urls_index page
app.post('/urls/:id/delete', (req, res) => {
  console.log('\nNow in the POST for /urls/:id/delete');
  const shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect('/');
});

// TODO: Updating URLs - using a POST request (should allow to edit an
// existing URL)
// TODO: Once the user submits an Update request,
// it should modify the corresponding longURL, and
// then redirect the client back to "/urls".
app.post('/urls/:id/update', (req, res) => {
  const shortURL = req.params.id;
  const updatedLongURL = req.body.updatedLongURL;
  console.log('\nNow about to POST an update for /urls/:id/update');
  console.log('\nShortURL: ', shortURL);
  console.log('\nReq.body.updatedLongURL: ', updatedLongURL)
  urlDatabase[shortURL] = updatedLongURL;
  res.redirect('/urls');
});

// TODO: Create a GET /register endpoint,
// which returns a page that includes a form with an email and password
// field.
app.get('/register', (req, res) => {
  res.render('urls_register');
});

// TODO: Create a POST /register page that will take in incoming form data
// from the register.ejs form.
// This endpoint will handle all of the registration form data
app.post('/register', (req, res) => {
  console.log('Now making a POST on the /register endpoint!');
  const userID = makeRandomId()
  const userEmail = req.body.userEmail;
  const userPass = req.body.userPass;
  const newUser = {
    id: userID,
    email: userEmail,
    password: userPass
  }
  console.log('\nNew User object: ', newUser)
  console.log('\nUser ID: ', userID);
  console.log('\nUser Email: ', userEmail);
  console.log('\nUser Pass: ', userPass);
  // TODO: Add newUser object to 'users' database object:
  // users database have keys which are the same as the userID.
  users[userID] = newUser;
  req.session.user_id  = users[userID].id
  res.redirect('/urls');
  console.log(users);
});

app.get('/login', (req, res) => {
  res.render('urls_login', {
  });
});

app.post('/login', (req, res) => {
  console.log('\nMaking a POST to the /login endpoint');
  const email = req.body.email;
  const password = req.body.password;
  const user = findUserByEmail(email);
  if (!(users[user.id])) {
    res.send('You are not registered, please register <a href=\'/register\'>here</a>');
  } else {
    req.session.user_id = user.id
    console.log('\nCooke Session for Logged In User: ', req.session.user_id);
    res.redirect('/');
  }
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls_home');
});

app.listen(PORT, () => {
  console.log(`\nListening on PORT: ${PORT}\n`)
});
