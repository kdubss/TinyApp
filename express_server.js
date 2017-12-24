const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080 // default

app.set('view engine', 'ejs');

let urlDatabase = {
  'b2xVn2': "http://www.lighthouselabs.ca",
  '9sm5xK': "http://www.google.com"
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
    shortURL: shortURL
  });
});

app.listen(PORT, () => {
  console.log(`\nListening on PORT: ${PORT}\n`)
});
