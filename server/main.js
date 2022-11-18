//
// PORT=8080 PORT_SSL=8443 CERT='server/tempssl/cert.pem' KEY='server/tempssl/key.pem' node server/main.js
//

// Importing express module
const express = require("express");
const app = express();
const http = require('http');
const https = require('https');
const fs = require("fs");
const { env } = require("process");
// Preloaded
const teamsJSON = JSON.parse(fs.readFileSync("www/src/assets/teams.json"));
const certificate = fs.readFileSync(env.CERT || "/etc/letsencrypt/live/budexit.wroclaw.pl/fullchain.pem", 'utf8');
const privatekey  = fs.readFileSync(env.KEY || "/etc/letsencrypt/live/budexit.wroclaw.pl/privkey.pem", 'utf8');
const credentials = {key: privatekey, cert: certificate};

const HTTP_PORT = env.PORT || 80;
const HTTPS_PORT = env.PORT_SSL || 443;

// Handling GET /hello request
app.get("/hello", (req, res, next) => {
    res.send("This is the hello response");
});

// Actual Files
app.use(express.static('www/dist'));
app.use("/src/assets/teams.json", (req, res, next) => {
	res.json(teamsJSON);
});

// Server setup
// HTTP & HTTPS
const server = http.createServer((req, res) => {
	res.writeHead(301,{Location: `https://${req.headers.host}${req.url}`});
	res.end();
}).listen(HTTP_PORT, () => {
    console.log("HTTP Redirect is running")
});
const serverSSL = https.createServer(
	credentials, app
).listen(HTTPS_PORT, () => {
    console.log("HTTPS Server is running")
	console.log(`https://localhost:${HTTPS_PORT}/`);
});