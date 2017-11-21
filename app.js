const http = require("http");
const PORT = 8080;

// Function to handle requests and returns responses.
function requestHandler(req, res) {
  res.end(`\nRequested Path: ${req.url}\nRequest Method: ${req.method}`);
}

var server = http.createServer(requestHandler);

server.listen(PORT () => {
  console.log(`Server listening on http://localhost:${PORT}`);
})