const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8080 // default

app.set('view engine', 'ejs');
app.use(bodyParser());
// BodyParser is a middleware that allows the parsing of inocming requests via
// <forms> or <input> elements, through the req.body

let urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
}

app.get('/', (req, res) => {
  res.send('Hello!');
});
app.get('/hello', (req, res) => {
  res.send(`\nURL Database: ${urlDatabase}`);
});

// TODO: Add new route handler ('/urls') and use res.render() to pass url
// data to the url_index.ejs template.
app.get('/urls', (req, res) => {
  console.log('\nWe\'re about to render the EJS page!\n');
  res.render('urls_index', {
    urls: urlDatabase,
    shortURL: req.params.id
  });
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

app.listen(PORT, () => {
  console.log(`\nListening on PORT: ${PORT}\n`)
});
