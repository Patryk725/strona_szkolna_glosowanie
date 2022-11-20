// Importing express module
const express = require("express");
const app = express();
const http = require('http');
const https = require('https');
const fs = require("fs");
const { env } = require("process");
// POST Body encoders
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
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
const gmailTemplate = String(fs.readFileSync("server/devgmail/template.html"));
const gmailLogo = fs.readFileSync("server/devgmail/logo.png");
const expected = JSON.parse(fs.readFileSync("server/dev/expected.json"));
const expectedMailHost = expected.mailHost;
// Email service
const nodemailer = require("nodemailer");
const { randomUUID } = require("crypto");

const validVotes = JSON.parse(fs.readFileSync("server/dev/votes.json"));;
const votesToConfirm = {};

function confirmVote(uuid) {
	const vote = votesToConfirm[uuid];
	validVotes.push({
		first: vote.first,
		second: vote.second,
		third: vote.third,
		name: vote.name,
		surname: vote.surname,
		class: vote.class,
		email: vote.email
	});

	delete votesToConfirm[uuid];
	
	try {
		fs.writeFileSync("server/dev/votes.json", JSON.stringify(validVotes));
	}
	catch(err) {
		console.error(err);
	}
}
function createVoteToConfirm(vote) {
	const uuid = randomUUID();
	votesToConfirm[uuid] = {
		first: vote.first,
		second: vote.second,
		third: vote.third,
		name: vote.name,
		surname: vote.surname,
		class: vote.class,
		email: vote.email
	};
	return uuid;
}

// console.log(`Before:\n To Confirm:`);
// console.log(votesToConfirm);
// console.log(` Valid:`);
// console.log(validVotes);
// const voteuuid = createVoteToConfirm({
// 	first: 0,
// 	second: 31,
// 	third: 22,
// 	name: "oki",
// 	surname: "doki",
// 	class: "Nauczyciel",
// 	email: "x@example.com"
// });
// console.log(`During:\n To Confirm:`);
// console.log(votesToConfirm);
// console.log(` Valid:`);
// console.log(validVotes);
// confirmVote(voteuuid);
// console.log(`After:\n To Confirm:`);
// console.log(votesToConfirm);
// console.log(` Valid:`);
// console.log(validVotes);


// Email transporter
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: gmailUser,
		pass: gmailPass,
	},
});
// Logo image for mails
app.use("/mail/logo.png", (req, res, next) => {
	res.send(gmailLogo);
});


// This function will send emails with personalised links to users
async function sendMail(mail, link) {
	// get the link into the email text
	const mailText = gmailTemplate.replaceAll("{%LINK}", link);
	// send mail with defined transport object
	const info = await transporter.sendMail({
		from: `"Budex" <${gmailUser}>`, // sender address
		to: mail, // list of receivers
		subject: "Potwierdzenie głosu.", // Subject line
		text: mailText, // plain text body
		html: mailText, // html body
	});

	console.log(`Email Message sent: ${info.messageId}`);
}

// sendMail("budexit@gmail.com", "https://stackoverflow.com/questions/21464285/how-to-display-a-long-link-in-multiple-lines-via-css").catch(console.error);

app.post("/submit_vote", async(req, res, next) => {
	console.log(req.body);

	if( !(
		// Vote validity
		req.body.first >= 0 && req.body.first <= 31 &&
		req.body.second >= 0 && req.body.second <= 31 &&
		req.body.third >= 0 && req.body.third <= 31 &&
		// User data
		req.body.name &&
		req.body.surname &&
		req.body.class &&
		req.body.email 
	) ) {
		console.error("User data is incorrect.");
		res.send("Data Incorrect");
		return;
	}

	const mailHost = req.body.email.split('@')[1];
	// console.log(`User From ${mailHost}`);

	if(mailHost != expectedMailHost) {
		console.error("User email is from another host.");
		res.send("Email Incorrect");
		return;
	}

	console.log(`Sending Confirmation email to ${req.body.email}`);
	
	try {
		await sendMail(req.body.email, "https://trololololololo.com/");
	}
	catch(err) {
		console.error(err);
		res.send("Email Error");
		return;
	}

	res.send("Ok");
});
// ON THE CLIENT SIDE:
// fetch("/submit_vote", {
// 	headers: {
// 	'Accept': 'application/json',
// 	'Content-Type': 'application/json'
// 	},
// 	method: "POST",
// 	body: JSON.stringify({
// 		first: 31,
// 		second: 22,
// 		third: 15,
// 		name: "k",
// 		surname: "b",
// 		class: "4i",
// 		email: "k.b@z.p.pl"
// 	})
// })
// .then(res => res.text())
// .then(txt => {console.log("GOT:" + txt)});


// Actual Files - Website host
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