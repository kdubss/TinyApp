const http = require("http");
const PORT = 8080;

// Function to handle requests and returns responses.
function requestHandler(req, res) {
  if (req.url == "/") {
    res.end("Welcome!");
  } else if (req.url == "/urls") {
    res.end("www.lighthouselabs.ca\nwww.google.ca");
  } else {
    res.statusCode = 404;
    res.end("Unknown path!");
  }
}

var server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
})
// Returns request path (route) and the request method, which is a GET
// (i.e. fetching a web page).
