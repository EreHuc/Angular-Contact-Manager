const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const utils = require('./utils');
const fs = require('fs');
const path = require('path');

const mySuperSecret = require('../../key')[0];

const transporter = nodemailer.createTransport(smtpTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAILUSER || mySuperSecret.user,
    pass: process.env.MAILPASSWORD || mySuperSecret.password,
  },
}));


const loadVerificationTemplate = (user, url) => {
  let template = fs.readFileSync(path.join(__dirname, './emails-template/verify-email.template.html'), 'utf-8');
  template = template.replace('__firstname__', user.firstname);
  template = template.replace('__lastname__', user.lastname);
  template = template.replace('__url__', url);
  return template;
};

const verificationEmail = (user, url) => ({
  to: user.email,
  from: 'Do Not Reply <user@gmail.com>',
  subject: 'Confirm your email',
  html: loadVerificationTemplate(user, url),
});

const sendVerificationMail = (user) => {
  const hash = utils.hash(32);
  let url = `http://${process.env.host}:4200/verify/${hash}`;
  if (process.env.NODE_ENV === 'production') {
    url = `http://${process.env.APPURL}/verify/${hash}`;
  }
  const mailOptions = verificationEmail(user, url);
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        reject(new Error(error));
      }
      resolve({ hash });
    });
  });
};

module.exports = { sendVerificationMail };

