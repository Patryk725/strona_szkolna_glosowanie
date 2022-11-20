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

// Voting Mechanism
const validVotes = JSON.parse(fs.readFileSync("server/dev/votes.json"));;
const votesToConfirm = {};
function confirmVote(uuid) {
	if(!votesToConfirm[uuid]) {
		return false;
	}

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

	return true;
}
function createVoteToConfirm(vote) {
	// Ensure UUID is unique (prolly not needed but i'm pedantic)
	let genuuid;
	do {
		genuuid = randomUUID();
	} while(votesToConfirm[genuuid]);
	// Cast vote to the confirm queue
	const uuid = genuuid;
	votesToConfirm[uuid] = {
		first: vote.first,
		second: vote.second,
		third: vote.third,
		name: vote.name,
		surname: vote.surname,
		class: vote.class,
		email: vote.email
	};

	// DELETE AFTER {
	console.log(`UUID ${uuid} generated!`);
	// DELETE AFTER }

	setTimeout(()=>{
		if(!votesToConfirm[uuid]) {
			return;
		}
		delete votesToConfirm[uuid];
		console.log(`UUID ${uuid} for ${vote.name} ${vote.surname} at ${vote.email} timed out!`);
	}, 30*1000);
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
// const voteuuid2 = createVoteToConfirm({
// 	first: 4,
// 	second: 23,
// 	third: 30,
// 	name: "ekisaf",
// 	surname: "dsaf",
// 	class: "4i",
// 	email: "y@example.com"
// });
// console.log(`During:\n To Confirm:`);
// console.log(votesToConfirm);
// console.log(` Valid:`);
// console.log(validVotes);
// confirmVote(voteuuid2);
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

// Vote Submission
// This function will send emails with personalised links to users
async function sendMail(voteuuid) {
	// the vote-related data
	const vote = votesToConfirm[voteuuid];
	// get the user-specific data into the email text
	const mailText = gmailTemplate
	.replaceAll("{%LINK}", `https://budex.live/confirm_vote?id=${voteuuid}`)
	.replaceAll("{%NAME}", vote.name)
	.replaceAll("{%SURNAME}", vote.surname)
	.replaceAll("{%CLASS}", (vote.class == "Nauczyciel" ? "nauczycielką/em" : ("w klasie " + vote.class)))
	.replaceAll("{%FIRST}", teamsJSON[parseInt(vote.first)].name)
	.replaceAll("{%SECOND}", teamsJSON[parseInt(vote.second)].name)
	.replaceAll("{%THIRD}", teamsJSON[parseInt(vote.third)].name);
	// send mail with defined transport object
	const info = await transporter.sendMail({
		from: `"Budex" <${gmailUser}>`, // sender address
		to: vote.email, // list of receivers
		subject: "Potwierdzenie głosu.", // Subject line
		text: mailText, // plain text body
		html: mailText, // html body
	});

	console.log(`Email Message sent: ${info.messageId}`);
}
app.post("/submit_vote", async(req, res, next) => {
	// console.log(req.body);
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

	const vote = {
		first: req.body.first,
		second: req.body.second,
		third: req.body.third,
		name: req.body.name,
		surname: req.body.surname,
		class: req.body.class,
		email: req.body.email,
	};
	const voteuuid = createVoteToConfirm(vote);

	console.log(`Sendindg Confirmation email to ${req.body.email}`);

	try {
		await sendMail(voteuuid);
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

// Vote Confirmation
app.get("/confirm_vote", (req, res, next) => {
	// console.log(req.query);
	const votedata = votesToConfirm[req.query.id];

	if(!confirmVote(req.query.id)) {
		res.send(`Hello, ${req.query.id}! You are not on the list! You were propably timed out!`);
		return;
	}
	
	res.send(`Hello, ${votedata.name} ${votedata.surname}! You've voted for ${votedata.first} i see? ^^`);
});
// ON THE CLIENT SIDE:
// https://localhost:8443/confirm_vote?id=37e9206c-0d54-4f2b-addc-b77bf697e68d

// TODO: INVALIDATE VOTE (If the user told incorrect data)


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