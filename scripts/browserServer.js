const http = require("http");
const path = require("path");
const fs = require("fs");
const chokidar = require("chokidar");
const socket = require("socket.io");

const PORT = process.argv[2] || 5678;
const URL = `http://localhost:${PORT}/`;

const server = http.createServer((req, res) => {
  const filePath = req.url === "/" ? "./index.html" : req.url.includes("/dist") ? "../.." + req.url : "." + req.url;
  const fullPath = path.resolve(__dirname, "../example/browser", filePath);

  const contentType = { "Content-Type": "text/plain" };
  const fileType = fullPath.split(".").at(-1);

  switch (fileType) {
    case "js":
      contentType["Content-Type"] = "application/javascript";
      break;
    case "css":
      contentType["Content-Type"] = "text/css";
      break;
    case "html":
      contentType["Content-Type"] = "text/html";
      break;
  }

  fs.readFile(fullPath, (err, data) => {
    let statusCode = 200;
    let _data = data;

    if (err) {
      statusCode = 404;
      _data = "Not Found";
    }

    res.writeHead(statusCode, contentType);
    res.end(data);
  });
});

const io = socket(server);

server.listen(PORT, () => {
  console.log(`Browser Server is running at ${URL}`);
});

const watcher = chokidar.watch(path.resolve(__dirname, "../example"));

let connect;
io.on("connection", (socket) => {
  if (!connect) {
    console.log("HMR ready");
    connect = true;
  }

  watcher.on("change", (path) => {
    console.log(`File ${path} has changed. Reloading...`);
    socket.emit("reload");
  });
});
