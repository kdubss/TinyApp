"use strict";

const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 8080; // Default port

const urlDatabase = {

    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com",

};

/**
 * [generateRandomString description]
 * @param  {[type]} len [description]
 * @return {[type]}     [description]
 */
function generateRandomString() {

  var randomStr = "";
  var alphaBit = "abcdefghikjlmnopqrstuvWxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  // Logic:
  // - Loop through 2 sets of alphabits (lower & upper case)
  // - with each iteration,
  //  - add on a random letter (based on the random index numbers generated by the alphabit string)
  //    to the existing empty string.
  // - The length of iteration is based on the input integer 'len'
  for (let i = 0; i < 6; i++) {

    randomStr += alphaBit.charAt(Math.floor(Math.random() * alphaBit.length));

  }

  return randomStr;

};

app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

app.get("/", (request, response) => {

    response.end("Hello!"); // The server sends the 'Hello!' message in Root/ upon a GET request.

});

// > Adding additional routes
app.get("/urls.json", (request, response) => {

    response.json(urlDatabase);

});

// > Route to HTML:
app.get("/hello", (request, response) => {

    response.end("<html><body><b>Helloooooo!</b></body></html>\n");

});

app.get("/urls", (request, response) => {

    response.render("urls_index", {

        urls: urlDatabase,
        username: request.cookies["username"]

    });

})

app.get("/url", (request, response) => {

    response.render("urls_show", {

        shortURL: urlDatabase

    });

})

app.get("/urls/new", (request, response) => {

  response.render("urls_new");

})

// Redirecting Short URLs - Logic:
// - New route added to request the shortURL

app.get("/u/:shortURL", (request, response) => {

  let shortURL = request.params.shortURL;

  if (urlDatabase[shortURL]) {

    response.redirect(urlDatabase[shortURL])

  }

});

app.post("/urls", (request, response) => {

  var newID = generateRandomString(); // Generate a new string ID

  console.log("newId ",newID);  // Printing out the new string ID (shortURL)
  console.log(request.body.longURL);  // Printing out the longURL

  urlDatabase[newID] = request.body.longURL;  // Updating the 'urlDatabase' object (created at the top of the script)
  console.log(urlDatabase);  // Printing out the 'urlDatabase' object to confirm the adding of the new shortURL
  //redirect the user to any place
  response.redirect("/urls")

});

app.post("/urls/:id/delete", (request, response) => {

  delete urlDatabase[request.params.id]

  response.redirect("/urls");

});

app.get("/urls/:id", (request, response) => {

  let shortURL = request.params.id;
  let longURL = urlDatabase[shortURL];

  response.render("urls_show", {shortURL: shortURL, longURL: longURL});

});

app.post("/urls/:id/update", (request, response) => {

  let shortURL = request.params.id;
  let longURL = request.body.updateURL;

  urlDatabase[shortURL] = longURL;

  response.redirect("/urls");

});

app.post("/login", (request, response) => {

  let username = request.body.login

  response.cookie("username", username);
  response.redirect("/urls");

});

app.post("/logout", (request, response) => {

  response.clearCookie("username", '', {});
  response.redirect("/urls");

})

app.listen(PORT, () => {

    console.log(`Example app listening on port ${PORT}!`);

});