const routes = require('express').Router();

routes.get('/', (req, res) => {
  res.redirect('urls_home');
});
routes.get('/urls_home', (req, res) => {
  const user = users[req.session.user_id];
  res.render('urls_home', {
    user: user
  });
})

// TODO: Add new route handler ('/urls') and use res.render() to pass url
// data to the url_index.ejs template.
routes.get('/urls', (req, res) => {
  const user = users[req.session.user_id];
  if (!user) {
    res.status(401).send(`Unauthorized access! Have you logged in? Click <a href='/login'>here</a>`)
    res.redirect('/');
  } else {
    res.render('urls_index', {
      urls: urlDatabase,
      shortURL: req.params.id,
      user: user
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
routes.get('/urls/:id', (req, res) => {
  const user = users[req.session.user_id];
  const shortURL = req.params.id;
  res.render('urls_show', {
    urls: urlDatabase,
    shortURL: shortURL,
    longURL: urlDatabase[shortURL],
    user: user
  });
});

routes.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id]
});

// TODO: In our urls_index.ejs template we will add a form element for
// each shortened URL. The form should use POST method:
// TODO: Add a POST route that removes a URL resource: POST /urls/:id/delete
// TODO: After the resource has been deleted, redirect the client back to the
// urls_index page
routes.post('/urls/:id/delete', (req, res) => {
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
routes.post('/urls/:id/update', (req, res) => {
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
routes.get('/register', (req, res) => {
  const user = users[req.session.user_id];
  res.render('urls_register', {
    user: user
  });
});

// TODO: Create a POST /register page that will take in incoming form data
// from the register.ejs form.
// This endpoint will handle all of the registration form data
routes.post('/register', (req, res) => {
  const userEmail = req.body.userEmail;
  const userPass = req.body.userPass;
  const newUser = {
    id: makeRandomId(),
    email: userEmail,
    password: bcrypt.hashSync(userPass, 10)
  }
  console.log('\nNew User object: ', newUser)
  console.log('\nUser Email: ', userEmail);
  console.log('\nUser Pass: ', userPass);
  // TODO: Add newUser object to 'users' database object:
  // users database have keys which are the same as the userID.
  // TODO: Registration errors:
  // 1. if users email === blank --> return a 404 status
  // 2. if users password === blank --> return a 404 status
  if (userEmail.length === 0 || userPass === 0) {
    res.status(404).send(
      `The <b>Email</b> and <b>Password</b> fields <u>cannot be blank</u>! <a href='/register'>Try again.</a>`
    );
  } else if (newUser.email === findUserByEmail(newUser.email)['email']) {
    res.status(400).send(
      `Bad Request! The <b>Email</b> is <u>already registered</u>! Please <a href='/register'>register</a> with another email or <a href='/'>go back</a>.`
    );
  } else {
    users[newUser.id] = newUser;
    req.session.user_id = users[newUser.id].id;
    res.redirect('/urls');
  }
});

routes.get('/login', (req, res) => {
  const user = users[req.session.user_id];
  res.render('urls_login', {
    user: user
  });
});

routes.post('/login', (req, res) => {
  const userEmail = req.body.email;
  const userPass = req.body.password;
  const user = findUserByEmail(userEmail);
  console.log('\nInput email length: ', userEmail.length);
  console.log('\nInput Password length: ', userPass.length);
  if (userEmail.length === 0 || userPass.length === 0) {
    res.status(403).send(`<b>403 Forbidden</b>! <b>Email</b> & <b>password</b> <u>cannot be blank</u>! <a href='/login'>Try again</a>!`);
  } else if (!users[user.id]) {
    res.status(401).send(`<b>401 Unauthorized</b>! Have you <a href='/register'>registered</a>? <a href='/login'>Try again.</a>`);
  } else {
    if (!bcrypt.compareSync(userPass, users[user.id].password)) {
      res.status(401).send(`<b>401 Unauthorized</b>! Email and/or password is incorrect! <a href='/login'>Try again.</a>`);
    }
    else {
      req.session.user_id = users[user.id].id
      res.redirect('/urls');
    }
  }
});

routes.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls_home');
});
