const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "public");
const port = Number(process.env.PORT || 3000);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg"
};

http.createServer((request, response) => {
  const requested = decodeURIComponent(request.url.split("?")[0]);
  const safePath = path.normalize(requested).replace(/^(\.\.[/\\])+/, "");
  let filePath = path.join(root, safePath === "/" ? "index.html" : safePath);

  if (!filePath.startsWith(root)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (!statError && stats.isDirectory()) filePath = path.join(filePath, "index.html");
    fs.readFile(filePath, (error, content) => {
      if (error) {
        fs.readFile(path.join(root, "index.html"), (fallbackError, fallback) => {
          if (fallbackError) response.writeHead(404).end("Not found");
          else response.writeHead(200, { "Content-Type": mime[".html"] }).end(fallback);
        });
        return;
      }
      response.writeHead(200, {
        "Content-Type": mime[path.extname(filePath)] || "application/octet-stream",
        "Cache-Control": path.extname(filePath) === ".html" ? "no-cache" : "public, max-age=86400"
      });
      response.end(content);
    });
  });
}).listen(port, "0.0.0.0", () => {
  console.log(`Portfolio live at http://localhost:${port}`);
});
