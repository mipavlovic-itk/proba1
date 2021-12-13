const sgMail = require("@sendgrid/mail");
const { MongoInvalidArgumentError } = require("mongoose/node_modules/mongodb");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "milan.pavlovic1998@gmail.com",
    subject: "NASLOV",
    text: `Welcome to the app, ${name}. Leet me know how you get along with the app`,
  });
};

const sendGoodbyeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "milan.pavlovic1998@gmail.com",
    subject: "NASLOV",
    text: `Why you leaving, ${name}. Do not be stupid`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendGoodbyeEmail,
};
