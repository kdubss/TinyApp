let express = require('express');
let app = express();
let PORT = process.env.PORT || 8080 // default

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
})
// TODO: Add new route handler ('/urls') and use res.render() to pass url
// data to the url_index.ejs template.
app.get('/urls', (req, res) => {
  res.render('urls_index', {
    urls: urlDatabase
  });
})

app.listen(PORT, () => {
  console.log(`\nListening on PORT: ${PORT}\n`)
});
