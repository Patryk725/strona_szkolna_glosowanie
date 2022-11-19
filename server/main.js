//
// PORT=8080 PORT_SSL=8443 CERT='server/devssl/cert.pem' KEY='server/devssl/key.pem' node server/main.js
//

// Importing express module
const express = require("express");
const app = express();
const http = require('http');
const https = require('https');
const fs = require("fs");
const { env } = require("process");
// Preloads and globals
const teamsJSON = JSON.parse(fs.readFileSync("www/src/assets/teams.json"));
const certificate = fs.readFileSync(env.CERT || "/etc/letsencrypt/live/budex.live/fullchain.pem", 'utf8');
const privatekey  = fs.readFileSync(env.KEY || "/etc/letsencrypt/live/budex.live/privkey.pem", 'utf8');
const credentials = {key: privatekey, cert: certificate};
const HTTP_PORT = env.PORT || 80;
const HTTPS_PORT = env.PORT_SSL || 443;
const gmailCred = JSON.parse(fs.readFileSync("server/devgmail/creds.json"));
const gmailUser = gmailCred.address;
const gmailPass = gmailCred.password;

// Email service
"use strict";
const nodemailer = require("nodemailer");

// Email transporter
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: gmailUser,
		pass: gmailPass,
	},
});

// Handling GET /hello request
// app.get("/hello", (req, res, next) => {
//     res.send("This is the hello response");
// });


// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Budex" <budexit@gmail.com>', // sender address
    to: "lavionperavion@gmail.com, lavionperavion2@gmail.com, budexit@gmail.com", // list of receivers
    subject: "Nodemailer pub test 2✔", // Subject line
    text: "Hello gyus?", // plain text body
    html: "<h1>i think that's it</h1>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);




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