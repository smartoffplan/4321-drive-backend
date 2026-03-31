const http = require("http");

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  console.log(`📩 Received request: ${req.method} ${req.url}`);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      message: "🚀 4321 Drive Master Diagnostic Server is ONLINE!",
      timestamp: new Date().toISOString(),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
      },
    }),
  );
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✨ DEBUG SERVER IS LISTENING ON PORT ${PORT} ✨`);
});
