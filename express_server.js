let express = require("express");
let app = express();
let PORT = process.env.PORT || 8080 // default
 
let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}
 
app.get("/", (req, res) => {
  res.end("Hello!");
});
 
app.listen(PORT () => {
  console.log(`\nListening on PORT: ${PORT}\n`);
})