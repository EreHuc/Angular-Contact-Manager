let nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
let utils = require('./utils');
let mySuperSecret = require('../../key.ts');
let fs = require('fs');
let path = require('path');

let transporter;

if (process.env.NODE_ENV === 'production') {
	transporter = nodemailer.createTransport(smtpTransport({
		service: `Gmail`,
		auth: {
			user: mySuperSecret.user,
			pass: mySuperSecret.password
		}
	}));
} else {
  transporter = nodemailer.createTransport({
		host: 'localhost',
		port: 2525,
		secure: false
	});
}

let loadVerificationTemplate = (user, url) => {
		let template = fs.readFileSync(path.join(__dirname,'./emails-template/verify-email.template.html'), 'utf-8');
		template = template.replace('__firstname__', user.firstname);
		template = template.replace('__lastname__', user.lastname);
		template = template.replace('__url__', url);
		return template;
};

let verificationEmail = (user, url) => {
	return {
		to: user.email,
		from: `Do Not Reply <user@gmail.com>`,
		subject: `Confirm your email`,
		html: loadVerificationTemplate(user, url)
	}
};

let sendVerificationMail = (user) => {
	let hash = utils.hash(32);
	let url = `http://${process.env.host}:${process.env.NODE_ENV === 'production' ? process.env.port : '3000'}/verify/${hash}`;
	let mailOptions = verificationEmail(user, url);
	return new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				reject(new Error(error));
			}
			resolve({hash: hash});
		});
	});
};

module.exports = {sendVerificationMail};

